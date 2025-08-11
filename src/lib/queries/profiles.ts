import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(
  userId: string, 
  updates: Partial<Omit<Profile, 'user_id' | 'created_at'>>
): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  return data
}

export async function updateUserSubscription(
  customerId: string,
  subscriptionStatus: string,
  plan: 'free' | 'pro'
): Promise<boolean> {
  const supabase = await createServiceClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscriptionStatus,
      plan: plan,
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating user subscription:', error)
    return false
  }

  return true
}

export async function setStripeCustomerId(
  userId: string,
  customerId: string
): Promise<boolean> {
  const supabase = await createServiceClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ stripe_customer_id: customerId })
    .eq('user_id', userId)

  if (error) {
    console.error('Error setting Stripe customer ID:', error)
    return false
  }

  return true
}

export async function getUserByCustomerId(customerId: string): Promise<Profile | null> {
  const supabase = await createServiceClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error) {
    console.error('Error fetching user by customer ID:', error)
    return null
  }

  return data
}