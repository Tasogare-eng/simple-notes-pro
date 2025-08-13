'use server'

import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/utils/auth'
import { getUserProfile, setStripeCustomerId } from '@/lib/queries/profiles'
import { createOrRetrieveCustomer, createCheckoutSession, createPortalSession } from '@/lib/stripe/server'

export async function initiateCheckout() {
  const user = await getAuthenticatedUser()

  try {
    console.log('Initiating checkout for user:', user.id)
    
    // Get user profile
    const profile = await getUserProfile(user.id)
    if (!profile) {
      console.error('Profile not found for user:', user.id)
      return { error: 'User profile not found' }
    }

    console.log('User profile:', { plan: profile.plan, stripeCustomerId: profile.stripe_customer_id })

    // Check if user is already on Pro plan
    if (profile.plan === 'pro') {
      console.log('User already on Pro plan')
      return { error: 'You are already subscribed to the Pro plan' }
    }

    // Create or retrieve Stripe customer
    console.log('Creating/retrieving Stripe customer...')
    const customer = await createOrRetrieveCustomer(
      user.email!,
      user.id,
      profile.stripe_customer_id
    )

    console.log('Stripe customer:', customer.id)

    // Save customer ID if it's new
    if (!profile.stripe_customer_id) {
      console.log('Saving new Stripe customer ID')
      await setStripeCustomerId(user.id, customer.id)
    }

    // Get the price ID from environment
    const priceId = process.env.STRIPE_PRICE_ID
    console.log('Using price ID:', priceId)
    if (!priceId) {
      console.error('STRIPE_PRICE_ID not configured')
      return { error: 'Payment configuration error: Price ID not configured' }
    }

    // Create checkout session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    console.log('Creating checkout session with:', {
      customerId: customer.id,
      priceId,
      siteUrl,
      successUrl: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/cancel`
    })
    
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${siteUrl}/cancel`
    )

    console.log('Checkout session created:', { id: session.id, url: session.url })

    if (session.url) {
      redirect(session.url)
    } else {
      console.error('No checkout URL in session:', session)
      return { error: 'No checkout URL received' }
    }
  } catch (error) {
    console.error('Checkout error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    return { error: `Failed to initiate checkout: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

export async function openCustomerPortal() {
  const user = await getAuthenticatedUser()

  try {
    // Get user profile with Stripe customer ID
    const profile = await getUserProfile(user.id)
    if (!profile) {
      return { error: 'User profile not found' }
    }

    if (!profile.stripe_customer_id) {
      return { error: 'No subscription found. Please subscribe first.' }
    }

    // Create customer portal session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const session = await createPortalSession(
      profile.stripe_customer_id,
      `${siteUrl}/billing`
    )

    if (session.url) {
      redirect(session.url)
    } else {
      return { error: 'No portal URL received' }
    }
  } catch (error) {
    console.error('Portal error:', error)
    return { error: 'Failed to open customer portal' }
  }
}