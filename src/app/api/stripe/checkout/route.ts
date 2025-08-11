import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrRetrieveCustomer, createCheckoutSession } from '@/lib/stripe/server'
import { getUserProfile, setStripeCustomerId } from '@/lib/queries/profiles'

export async function POST() {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const profile = await getUserProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check if user is already on Pro plan
    if (profile.plan === 'pro') {
      return NextResponse.json(
        { error: 'You are already subscribed to the Pro plan' }, 
        { status: 400 }
      )
    }

    // Create or retrieve Stripe customer
    const customer = await createOrRetrieveCustomer(
      user.email!,
      user.id,
      profile.stripe_customer_id
    )

    // Save customer ID if it's new
    if (!profile.stripe_customer_id) {
      await setStripeCustomerId(user.id, customer.id)
    }

    // Get the price ID from environment
    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) {
      console.error('STRIPE_PRICE_ID is not configured')
      return NextResponse.json(
        { error: 'Payment configuration error' }, 
        { status: 500 }
      )
    }

    // Create checkout session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${siteUrl}/cancel`
    )

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' }, 
      { status: 500 }
    )
  }
}