/**
 * POST /api/billing-portal
 *
 * Creates a Stripe Customer Portal session for a subscriber and redirects
 * them so they can self-serve cancel, update billing info, etc.
 *
 * This prevents chargebacks from subscribers who cannot find a cancel button.
 *
 * Body (JSON):
 *   email      string  required  Subscriber's email address
 *   return_url string  optional  Where to send the user after the portal
 *                                (defaults to NEXT_PUBLIC_BASE_URL/join)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : null
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://gputnammusic.com'
  const returnUrl =
    (typeof body.return_url === 'string' ? body.return_url : null) ?? `${baseUrl}/join`

  // Look up the Stripe customer_id stored in gpm_donations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: donation } = await supabase
    .from('gpm_donations')
    .select('stripe_customer_id')
    .eq('donor_email', email)
    .not('stripe_customer_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!donation?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No active subscription found for this email' },
      { status: 404 }
    )
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
  })

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: donation.stripe_customer_id as string,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err: unknown) {
    console.error('[billing-portal] Stripe error', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
