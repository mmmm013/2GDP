import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * POST /api/histor-inquiry
 *
 * Saves a HISTOR™ backer/investor inquiry to Supabase `histor_inquiries` table.
 * Table DDL (run once in Supabase SQL editor):
 *
 *   CREATE TABLE IF NOT EXISTS histor_inquiries (
 *     id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *     name        text NOT NULL,
 *     email       text NOT NULL,
 *     company     text,
 *     type        text NOT NULL,
 *     message     text NOT NULL,
 *     created_at  timestamptz DEFAULT now()
 *   );
 */

const MAX_LEN = 2000;
const clean = (v: unknown, max = 500): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

const VALID_TYPES = ['investor', 'licensor', 'acquisition', 'other'] as const;
type InquiryType = (typeof VALID_TYPES)[number];
const isValidType = (v: string): v is InquiryType =>
  (VALID_TYPES as readonly string[]).includes(v);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const company = clean(body.company);
  const typeRaw = clean(body.type);
  const message = clean(body.message, MAX_LEN);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'name, email, and message are required' },
      { status: 400 }
    );
  }

  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const type: InquiryType = isValidType(typeRaw) ? typeRaw : 'other';

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { error: dbError } = await supabase.from('histor_inquiries').insert({
      name,
      email,
      company: company || null,
      type,
      message,
    });

    if (dbError) {
      console.error('[HISTOR-INQUIRY] Supabase insert error:', dbError.message);
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[HISTOR-INQUIRY] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
