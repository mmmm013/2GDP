import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// POST /api/heroes/submit
// Body: { name?: string, hero: string, category: string, story: string }
// Inserts a hero recognition story into the hero_stories table.

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, hero, category, story } = body

  if (!hero || !category || !story) {
    return NextResponse.json(
      { error: 'Missing required fields: hero, category, story' },
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
    .from('hero_stories')
    .insert({
      name: name?.trim() || null,
      hero: hero.trim(),
      category: category.trim(),
      story: story.trim(),
    })
    .select()
    .single()

  if (error) {
    console.error('[heroes/submit] Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save story' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data?.id ?? null })
}
