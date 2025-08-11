import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import {
  handleCheckoutComplete,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from '@/lib/stripe/webhookHandlers'
import Stripe from 'stripe'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('No Stripe signature found')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`Received webhook: ${event.type} (${event.id})`)

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const result = await handleCheckoutComplete(session)
          if (!result.success) {
            console.error('Failed to handle checkout completion:', result.error)
            return NextResponse.json({ error: result.error }, { status: 500 })
          }
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const result = await handleSubscriptionCreated(subscription)
        if (!result.success) {
          console.error('Failed to handle subscription creation:', result.error)
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const result = await handleSubscriptionUpdated(subscription)
        if (!result.success) {
          console.error('Failed to handle subscription update:', result.error)
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const result = await handleSubscriptionDeleted(subscription)
        if (!result.success) {
          console.error('Failed to handle subscription deletion:', result.error)
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Payment succeeded for invoice ${invoice.id}`)
        // Additional handling can be added here if needed
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Payment failed for invoice ${invoice.id}`)
        // Additional handling can be added here (e.g., notify user)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true, eventId: event.id })

  } catch (error) {
    console.error(`Error processing webhook ${event.id}:`, error)
    return NextResponse.json(
      { error: 'Webhook processing failed', eventId: event.id }, 
      { status: 500 }
    )
  }
}