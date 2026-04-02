import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 200) {
    return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    return NextResponse.json({
      tier: session.metadata?.tier ?? null,
      donorName: session.metadata?.donorName || null,
      donorEmail: session.metadata?.donorEmail || null,
      grandPrizeEligible: session.metadata?.tier !== 'tap',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    console.error('session-status error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
