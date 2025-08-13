import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

export async function createOrRetrieveCustomer(
  email: string,
  userId: string,
  stripeCustomerId?: string | null
) {
  if (stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(stripeCustomerId)
      if (!customer.deleted) {
        return customer as Stripe.Customer
      }
    } catch (error) {
      console.error('Error retrieving customer:', error)
    }
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  return customer
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  console.log('Creating Stripe checkout session with params:', {
    customerId,
    priceId,
    successUrl,
    cancelUrl
  })

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          customerId,
        },
      },
    })

    console.log('Stripe checkout session created successfully:', {
      id: session.id,
      url: session.url,
      customer: session.customer
    })

    return session
  } catch (error) {
    console.error('Stripe checkout session creation failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      customerId,
      priceId
    })
    throw error
  }
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscriptionStatus(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 1,
  })

  if (subscriptions.data.length === 0) {
    return null
  }

  return subscriptions.data[0]
}