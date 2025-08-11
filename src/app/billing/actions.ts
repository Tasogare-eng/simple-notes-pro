'use server'

import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/utils/auth'
import { getUserProfile, setStripeCustomerId } from '@/lib/queries/profiles'
import { createOrRetrieveCustomer, createCheckoutSession, createPortalSession } from '@/lib/stripe/server'

export async function initiateCheckout() {
  const user = await getAuthenticatedUser()

  try {
    // Get user profile
    const profile = await getUserProfile(user.id)
    if (!profile) {
      return { error: 'User profile not found' }
    }

    // Check if user is already on Pro plan
    if (profile.plan === 'pro') {
      return { error: 'You are already subscribed to the Pro plan' }
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
      return { error: 'Payment configuration error' }
    }

    // Create checkout session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${siteUrl}/cancel`
    )

    if (session.url) {
      redirect(session.url)
    } else {
      return { error: 'No checkout URL received' }
    }
  } catch (error) {
    console.error('Checkout error:', error)
    return { error: 'Failed to initiate checkout' }
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