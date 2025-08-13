import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getAuthenticatedUser() {
  console.log('getAuthenticatedUser called')
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  console.log('Auth check result:', { user: !!user, error: !!error })
  
  if (error || !user) {
    console.log('User not authenticated, redirecting to signin')
    redirect('/auth/signin')
  }
  
  console.log('User authenticated:', user.id)
  return user
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}