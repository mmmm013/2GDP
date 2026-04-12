import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Valid KUT families — open-ended for future types
const VALID_KUT_FAMILIES = ['K-KUT', 'mini-KUT', 'K-kUpId'] as const
const VALID_ITEM_TABLES  = ['k_kut_assets', 'pix_pck'] as const

// Resolve the calling user's ID from the Authorization Bearer token.
async function resolveUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return null

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const client = createClient(url, anonKey, { auth: { persistSession: false } })

  const { data: { user }, error } = await client.auth.getUser(token)
  if (error || !user) return null
  return user.id
}

// POST /api/pre-order
// Body: {
//   kut_family : 'K-KUT' | 'mini-KUT' | 'K-kUpId' | string  (open for future)
//   item_table : 'k_kut_assets' | 'pix_pck'
//   item_id    : uuid
//   notes?     : string
// }
// Creates (or idempotently returns) a commemorative pre-order for the
// authenticated user.  The item must have is_commemorative=true.
export async function POST(req: NextRequest) {
  const userId = await resolveUserId(req)
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { kut_family, item_table, item_id, notes } = body as {
    kut_family: string
    item_table: string
    item_id: string
    notes?: string
  }

  if (!kut_family || !item_table || !item_id) {
    return NextResponse.json(
      { error: 'Missing required fields: kut_family, item_table, item_id' },
      { status: 400 }
    )
  }

  if (!VALID_ITEM_TABLES.includes(item_table as (typeof VALID_ITEM_TABLES)[number])) {
    return NextResponse.json(
      { error: `item_table must be one of: ${VALID_ITEM_TABLES.join(', ')}` },
      { status: 400 }
    )
  }

  // Validate UUID format
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item_id)) {
    return NextResponse.json({ error: 'item_id must be a valid UUID' }, { status: 400 })
  }

  // Verify the item exists and is marked is_commemorative=true
  const { data: item, error: itemErr } = await supabaseAdmin
    .from(item_table)
    .select('id, is_commemorative')
    .eq('id', item_id)
    .single()

  if (itemErr || !item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  if (!item.is_commemorative) {
    return NextResponse.json(
      { error: 'Item is not a Commemorative KUT — pre-order unavailable' },
      { status: 422 }
    )
  }

  // Upsert: idempotent — existing pending/ready pre-order is returned as-is
  const { data: preorder, error: insertErr } = await supabaseAdmin
    .from('commemorative_preorders')
    .upsert(
      {
        kut_family,
        item_table,
        item_id,
        user_id: userId,
        notes: notes ?? null,
      },
      { onConflict: 'item_table,item_id,user_id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (insertErr) {
    console.error('[pre-order POST]', insertErr)
    return NextResponse.json({ error: 'Failed to create pre-order' }, { status: 500 })
  }

  return NextResponse.json(preorder, { status: preorder ? 200 : 201 })
}

// GET /api/pre-order?status=pending
// Returns the authenticated user's pre-orders, optionally filtered by status.
export async function GET(req: NextRequest) {
  const userId = await resolveUserId(req)
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const statusFilter = searchParams.get('status')

  let query = supabaseAdmin
    .from('commemorative_preorders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data, error } = await query

  if (error) {
    console.error('[pre-order GET]', error)
    return NextResponse.json({ error: 'Failed to fetch pre-orders' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
