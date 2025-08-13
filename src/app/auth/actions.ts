'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Provider } from '@supabase/supabase-js'

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate input
  const result = signUpSchema.safeParse({ email, password })
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: 'Check your email to confirm your account',
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string | null

  console.log('SignIn action called for:', email, 'redirectTo:', redirectTo)

  // Validate input
  const result = signInSchema.safeParse({ email, password })
  if (!result.success) {
    console.log('SignIn validation failed:', result.error.issues[0].message)
    return {
      error: result.error.issues[0].message,
    }
  }

  const supabase = await createClient()

  console.log('Attempting Supabase signIn...')
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log('Supabase signIn error:', error.message)
    return {
      error: error.message,
    }
  }

  console.log('SignIn successful, redirecting to:', redirectTo || '/app')
  // Redirect to intended page or default to app
  redirect(redirectTo || '/app')
}

export async function signOut() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect('/')
}

export async function signInWithProvider(provider: Provider) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error(`${provider} OAuth error:`, error.message)
    redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }

  redirect('/auth/signin?error=OAuth+initialization+failed')
}