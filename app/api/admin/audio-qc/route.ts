import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// POST /api/admin/audio-qc
//
// Records an audio QC result for a k_kut_assets row or a pix_pck row.
// A 'pass' result allows the item to be activated (status → 'active' /
// is_active → true).  A 'fail' result automatically marks the item as
// free (is_free = true) so anon users can still access it.
//
// Auth: Bearer token matching ADMIN_SECRET (falls back to CRON_SECRET).
//       In non-production without a secret the check is skipped for dev/CI.
//
// Request body (JSON):
//   {
//     item_type : 'k_kut_asset' | 'pix_pck',  // which table to update
//     item_id   : string,                       // UUID of the row
//     result    : 'pass' | 'fail',              // QC outcome
//     notes?    : string,                       // optional admin notes (not persisted)
//   }
//
// Response 200:
//   {
//     ok         : true,
//     item_type  : string,
//     item_id    : string,
//     audio_qc_status : 'pass' | 'fail',
//     is_free    : boolean,
//     updated_at : string,
//   }
// ---------------------------------------------------------------------------

type ItemType = 'k_kut_asset' | 'pix_pck'
type QcResult = 'pass' | 'fail'

interface QcRequestBody {
  item_type: ItemType
  item_id: string
  result: QcResult
  notes?: string
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET ?? process.env.CRON_SECRET
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && !secret) {
    return false
  }

  if (!secret) {
    return true
  }

  return request.headers.get('authorization') === `Bearer ${secret}`
}

function getServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
  }
  return createClient(url, key)
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: QcRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { item_type, item_id, result } = body

  // Validate item_type
  if (item_type !== 'k_kut_asset' && item_type !== 'pix_pck') {
    return NextResponse.json(
      { error: 'item_type must be "k_kut_asset" or "pix_pck"' },
      { status: 400 }
    )
  }

  // Validate item_id is a non-empty string (UUID format)
  if (!item_id || typeof item_id !== 'string' || item_id.trim() === '') {
    return NextResponse.json({ error: 'item_id is required and must be a UUID string' }, { status: 400 })
  }

  // Validate result
  if (result !== 'pass' && result !== 'fail') {
    return NextResponse.json(
      { error: 'result must be "pass" or "fail"' },
      { status: 400 }
    )
  }

  try {
    const supabase = getServiceClient()
    const tableName = item_type === 'k_kut_asset' ? 'k_kut_assets' : 'pix_pck'

    // GAP-1: For a QC pass on k_kut_asset, verify the storage file actually exists
    // before committing the status change. A missing file would create a ghost-pass
    // (QC='pass' but audio 404s at play time).
    if (result === 'pass' && item_type === 'k_kut_asset') {
      const { data: asset, error: fetchErr } = await supabase
        .from('k_kut_assets')
        .select('storage_bucket, storage_path')
        .eq('id', item_id)
        .single()

      if (fetchErr || !asset) {
        return NextResponse.json(
          { error: 'k_kut_assets row not found', item_id },
          { status: 404 }
        )
      }

      if (!asset.storage_bucket || !asset.storage_path) {
        return NextResponse.json(
          { error: 'storage_bucket or storage_path is null — cannot pass QC without a file', item_id },
          { status: 422 }
        )
      }

      // Use storage.list() to confirm the file exists at the expected path.
      // storage_path may be 'folder/file.mp3' — split to (prefix, filename).
      const lastSlash = asset.storage_path.lastIndexOf('/')
      const folder = lastSlash >= 0 ? asset.storage_path.slice(0, lastSlash) : ''
      const filename = lastSlash >= 0 ? asset.storage_path.slice(lastSlash + 1) : asset.storage_path

      const { data: fileList, error: listErr } = await supabase.storage
        .from(asset.storage_bucket)
        .list(folder, { search: filename, limit: 1 })

      const fileExists = !listErr && Array.isArray(fileList) && fileList.some((f) => f.name === filename)

      if (!fileExists) {
        console.error(`[audio-qc] Storage file not found: ${asset.storage_bucket}/${asset.storage_path}`, listErr)
        return NextResponse.json(
          {
            error: 'Storage file not found — upload the audio file before marking QC pass',
            storage_bucket: asset.storage_bucket,
            storage_path: asset.storage_path,
          },
          { status: 422 }
        )
      }
    }

    const { data, error } = await supabase
      .from(tableName)
      .update({ audio_qc_status: result })
      .eq('id', item_id)
      .select('id, audio_qc_status, is_free, updated_at')
      .single()

    if (error) {
      console.error(`[audio-qc] Supabase error updating ${tableName}:`, error)
      // Surface DB-level guard violations clearly
      if (error.code === '23514') {
        return NextResponse.json(
          { error: 'DB constraint violation', detail: error.message },
          { status: 422 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update QC status', detail: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: `${tableName} row not found`, item_id },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        ok: true,
        item_type,
        item_id: data.id,
        audio_qc_status: data.audio_qc_status,
        is_free: data.is_free,
        updated_at: data.updated_at,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[audio-qc] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
