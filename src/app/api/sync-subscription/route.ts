import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/utils/auth'
import { getUserProfile } from '@/lib/queries/profiles'
import { syncCustomerSubscriptions } from '@/lib/stripe/webhookHandlers'

export async function POST(request: NextRequest) {
  try {
    console.log('Manual subscription sync requested')
    
    // Get authenticated user
    const user = await getAuthenticatedUser()
    const profile = await getUserProfile(user.id)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    console.log('Current profile state:', {
      userId: user.id,
      plan: profile.plan,
      subscriptionStatus: profile.subscription_status,
      stripeCustomerId: profile.stripe_customer_id
    })

    if (!profile.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer ID found. Please complete a payment first.' },
        { status: 400 }
      )
    }

    // Sync subscriptions from Stripe
    const syncResult = await syncCustomerSubscriptions(profile.stripe_customer_id)
    
    if (syncResult.success) {
      console.log('Subscription synced successfully:', syncResult)
      return NextResponse.json({
        success: true,
        message: 'Subscription synced successfully',
        plan: syncResult.plan,
        status: syncResult.status
      })
    } else {
      console.error('Sync failed:', syncResult.error)
      return NextResponse.json(
        { error: syncResult.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in manual sync:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}