import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// POST /api/admin/audio-qc
//
// Lone Admin endpoint — records an audio QC result (pass | fail) on a
// k_kut_assets row or a pix_pck row.
//
// The database triggers do the heavy lifting:
//   • FAIL  → is_free is automatically set to true     (Failure = FREE)
//   • PASS  → asset/package can now be activated
//   • Any attempt to activate without a PASS is blocked by DB trigger
//
// Auth: Bearer token matching CRON_SECRET (same pattern as lt-pix-mkut-check).
//       In non-production without CRON_SECRET the check is skipped for local dev.
//
// Request body:
//   {
//     target:   'asset' | 'package',   // k_kut_assets or pix_pck
//     id:       string,                // UUID of the row
//     result:   'pass' | 'fail',
//     note?:    string,                // optional QC note
//   }
//
// Response 200:
//   {
//     ok:             true,
//     target:         'asset' | 'package',
//     id:             string,
//     audio_qc_status: 'pass' | 'fail',
//     is_free:        boolean,
//     audio_qc_at:    string,          // ISO timestamp
//   }
//
// Response 422 — if trying to activate an item that has not yet passed QC,
//   the DB will throw; this route surfaces that as a structured error.
// ---------------------------------------------------------------------------

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  const isProd  = process.env.NODE_ENV === 'production'
  if (isProd && !secret) return false
  if (!secret) return true
  return request.headers.get('authorization') === `Bearer ${secret}`
}

function getServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
  }
  return createClient(url, key)
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { target, id, result, note } = body as {
    target?: unknown
    id?: unknown
    result?: unknown
    note?: unknown
  }

  // Validate inputs
  if (target !== 'asset' && target !== 'package') {
    return NextResponse.json(
      { error: 'target must be "asset" or "package"' },
      { status: 400 }
    )
  }
  if (typeof id !== 'string' || !id.trim()) {
    return NextResponse.json({ error: 'id (UUID string) is required' }, { status: 400 })
  }
  if (result !== 'pass' && result !== 'fail') {
    return NextResponse.json(
      { error: 'result must be "pass" or "fail"' },
      { status: 400 }
    )
  }

  const supabase = getServiceClient()

  try {
    if (target === 'asset') {
      // ── k_kut_assets ─────────────────────────────────────────────────────

      // GAP-1: For a QC pass, verify the storage file actually exists before
      // committing the status change. A missing file would create a ghost-pass
      // (QC='pass' but audio 404s at play time).
      if (result === 'pass') {
        const { data: assetCheck, error: fetchErr } = await supabase
          .from('k_kut_assets')
          .select('storage_bucket, storage_path')
          .eq('id', id)
          .single()

        if (fetchErr || !assetCheck) {
          return NextResponse.json({ error: 'k_kut_assets row not found', id }, { status: 404 })
        }

        if (!assetCheck.storage_bucket || !assetCheck.storage_path) {
          return NextResponse.json(
            { error: 'storage_bucket or storage_path is null — cannot pass QC without a file', id },
            { status: 422 }
          )
        }

        // Use storage.list() to confirm the file exists at the expected path.
        const lastSlash = assetCheck.storage_path.lastIndexOf('/')
        const folder   = lastSlash >= 0 ? assetCheck.storage_path.slice(0, lastSlash) : ''
        const filename = lastSlash >= 0 ? assetCheck.storage_path.slice(lastSlash + 1) : assetCheck.storage_path

        const { data: fileList, error: listErr } = await supabase.storage
          .from(assetCheck.storage_bucket)
          .list(folder, { search: filename, limit: 1 })

        const fileExists = !listErr && Array.isArray(fileList) && fileList.some((f) => f.name === filename)

        if (!fileExists) {
          console.error(`[audio-qc] Storage file not found: ${assetCheck.storage_bucket}/${assetCheck.storage_path}`, listErr)
          return NextResponse.json(
            {
              error: 'Storage file not found — upload the audio file before marking QC pass',
              storage_bucket: assetCheck.storage_bucket,
              storage_path: assetCheck.storage_path,
            },
            { status: 422 }
          )
        }
      }

      const updatePayload: Record<string, unknown> = {
        audio_qc_status: result,
        audio_qc_at:     new Date().toISOString(),
      }
      if (typeof note === 'string' && note.trim()) {
        updatePayload.audio_qc_note = note.trim()
      }

      const { data, error } = await supabase
        .from('k_kut_assets')
        .update(updatePayload)
        .eq('id', id)
        .select('id, variant, structure_tag, audio_qc_status, audio_qc_at, is_free, status')
        .single()

      if (error) {
        console.error('[audio-qc] k_kut_assets update error:', error)
        return NextResponse.json(
          { error: 'Failed to record QC result', detail: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        ok: true,
        target: 'asset',
        id: data.id,
        variant: data.variant,
        structure_tag: data.structure_tag,
        audio_qc_status: data.audio_qc_status,
        is_free: data.is_free,
        audio_qc_at: data.audio_qc_at,
        activation_status: data.status,
        ...(result === 'fail'
          ? { policy: 'Failure=FREE: is_free has been set to true. This item is now free for all users.' }
          : { policy: 'PASS recorded. Item may now be activated (status → active).' }),
      })
    }

    // ── pix_pck (mini-KUT parent packages) ─────────────────────────────────
    const updatePayload: Record<string, unknown> = {
      audio_qc_status: result,
      audio_qc_at:     new Date().toISOString(),
    }
    if (typeof note === 'string' && note.trim()) {
      updatePayload.audio_qc_note = note.trim()
    }

    const { data, error } = await supabase
      .from('pix_pck')
      .update(updatePayload)
      .eq('id', id)
      .select('id, title, pck_type, audio_qc_status, audio_qc_at, is_free, is_active')
      .single()

    if (error) {
      console.error('[audio-qc] pix_pck update error:', error)
      return NextResponse.json(
        { error: 'Failed to record QC result', detail: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      target: 'package',
      id: data.id,
      title: data.title,
      pck_type: data.pck_type,
      audio_qc_status: data.audio_qc_status,
      is_free: data.is_free,
      audio_qc_at: data.audio_qc_at,
      is_active: data.is_active,
      ...(result === 'fail'
        ? { policy: 'Failure=FREE: is_free has been set to true. This package (and its mini-KUTs) is now free for all users.' }
        : { policy: 'PASS recorded. Package may now be activated (is_active → true).' }),
    })
  } catch (err) {
    console.error('[audio-qc] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/audio-qc?target=asset|package&id=<uuid>
// Quick status check for a single item.
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target')
  const id     = searchParams.get('id')

  if (target !== 'asset' && target !== 'package') {
    return NextResponse.json(
      { error: 'target must be "asset" or "package"' },
      { status: 400 }
    )
  }
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const supabase = getServiceClient()

  if (target === 'asset') {
    const { data, error } = await supabase
      .from('k_kut_assets')
      .select('id, variant, structure_tag, audio_qc_status, audio_qc_at, audio_qc_note, is_free, status')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Asset not found', detail: error?.message }, { status: 404 })
    }
    return NextResponse.json({ target: 'asset', ...data })
  }

  const { data, error } = await supabase
    .from('pix_pck')
    .select('id, title, pck_type, audio_qc_status, audio_qc_at, audio_qc_note, is_free, is_active')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Package not found', detail: error?.message }, { status: 404 })
  }
  return NextResponse.json({ target: 'package', ...data })
}
