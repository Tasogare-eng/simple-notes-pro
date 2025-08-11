import Stripe from 'stripe'
import { stripe } from './server'
import { setStripeCustomerId, updateUserSubscription } from '@/lib/queries/profiles'

export async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id)

  try {
    const customerId = session.customer as string
    if (!customerId) {
      console.error('No customer ID in checkout session')
      return { success: false, error: 'No customer ID' }
    }

    // Get customer details from Stripe
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
    if (!customer.metadata?.userId) {
      console.error('No userId in customer metadata')
      return { success: false, error: 'No userId in metadata' }
    }

    const userId = customer.metadata.userId

    // Ensure customer ID is saved to user profile
    await setStripeCustomerId(userId, customerId)

    // Get the subscription from the session
    const subscriptionId = session.subscription as string
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      // Update user's subscription status
      const plan = ['active', 'trialing', 'past_due'].includes(subscription.status) ? 'pro' : 'free'
      await updateUserSubscription(customerId, subscription.status, plan)
      
      console.log(`Updated user ${userId} to ${plan} plan with status ${subscription.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error handling checkout completion:', error)
    return { success: false, error: 'Processing failed' }
  }
}

export async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.created:', subscription.id)

  try {
    const customerId = subscription.customer as string
    const plan = ['active', 'trialing', 'past_due'].includes(subscription.status) ? 'pro' : 'free'
    
    const success = await updateUserSubscription(customerId, subscription.status, plan)
    
    if (success) {
      console.log(`Subscription created: customer ${customerId} -> ${plan} (${subscription.status})`)
      return { success: true }
    } else {
      console.error('Failed to update user subscription on creation')
      return { success: false, error: 'Database update failed' }
    }
  } catch (error) {
    console.error('Error handling subscription creation:', error)
    return { success: false, error: 'Processing failed' }
  }
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated:', subscription.id)

  try {
    const customerId = subscription.customer as string
    const plan = ['active', 'trialing', 'past_due'].includes(subscription.status) ? 'pro' : 'free'
    
    const success = await updateUserSubscription(customerId, subscription.status, plan)
    
    if (success) {
      console.log(`Subscription updated: customer ${customerId} -> ${plan} (${subscription.status})`)
      return { success: true }
    } else {
      console.error('Failed to update user subscription on update')
      return { success: false, error: 'Database update failed' }
    }
  } catch (error) {
    console.error('Error handling subscription update:', error)
    return { success: false, error: 'Processing failed' }
  }
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted:', subscription.id)

  try {
    const customerId = subscription.customer as string
    
    // When subscription is deleted, user goes back to free plan
    const success = await updateUserSubscription(customerId, 'canceled', 'free')
    
    if (success) {
      console.log(`Subscription deleted: customer ${customerId} -> free plan`)
      return { success: true }
    } else {
      console.error('Failed to update user subscription on deletion')
      return { success: false, error: 'Database update failed' }
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
    return { success: false, error: 'Processing failed' }
  }
}

// Helper function to sync all subscriptions for a customer
export async function syncCustomerSubscriptions(customerId: string) {
  try {
    // Get all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 100
    })

    // Find the most recent active subscription
    const activeSubscription = subscriptions.data.find(sub => 
      ['active', 'trialing', 'past_due'].includes(sub.status)
    )

    let plan: 'free' | 'pro' = 'free'
    let status = 'canceled'

    if (activeSubscription) {
      plan = 'pro'
      status = activeSubscription.status
    } else {
      // Check for any subscription (even inactive ones) to get latest status
      const latestSubscription = subscriptions.data
        .sort((a, b) => b.created - a.created)[0]
      
      if (latestSubscription) {
        status = latestSubscription.status
      }
    }

    await updateUserSubscription(customerId, status, plan)
    
    console.log(`Synced customer ${customerId}: ${plan} plan with status ${status}`)
    return { success: true, plan, status }
    
  } catch (error) {
    console.error('Error syncing customer subscriptions:', error)
    return { success: false, error: 'Sync failed' }
  }
}