import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// POST /api/tt/submit
// Body: { title: string, story: string, isPrivate: boolean, authorName?: string, shareToHeroes: boolean }
// Inserts a Tale Tell story into the tt_stories table.

export async function POST(req: NextRequest) {
  let body: {
    title?: string
    story?: string
    isPrivate?: boolean
    authorName?: string
    shareToHeroes?: boolean
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, story, isPrivate = true, authorName, shareToHeroes = false } = body

  if (!title || !story) {
    return NextResponse.json(
      { error: 'Missing required fields: title, story' },
      { status: 400 },
    )
  }

  if (story.trim().length < 20) {
    return NextResponse.json(
      { error: 'Story must be at least 20 characters' },
      { status: 400 },
    )
  }

  const { data, error } = await supabaseAdmin
    .from('tt_stories')
    .insert({
      title: title.trim(),
      story: story.trim(),
      is_private: isPrivate,
      author_name: authorName?.trim() || null,
      share_to_heroes: shareToHeroes,
    })
    .select()
    .single()

  if (error) {
    console.error('[tt/submit] Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save story' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data?.id ?? null })
}
