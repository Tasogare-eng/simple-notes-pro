import { getUserProfile } from '@/lib/queries/profiles'
import { getUserNoteCount } from '@/lib/queries/notes'

const FREE_TIER_NOTE_LIMIT = 3

export async function canCreateNote(userId: string): Promise<boolean> {
  const [profile, noteCount] = await Promise.all([
    getUserProfile(userId),
    getUserNoteCount(userId)
  ])

  if (!profile) {
    return false
  }

  // Pro users have unlimited notes
  if (profile.plan === 'pro') {
    return true
  }

  // Free users are limited to 3 notes
  return noteCount < FREE_TIER_NOTE_LIMIT
}

export async function getRemainingNotes(userId: string): Promise<number> {
  const [profile, noteCount] = await Promise.all([
    getUserProfile(userId),
    getUserNoteCount(userId)
  ])

  if (!profile) {
    return 0
  }

  // Pro users have unlimited notes
  if (profile.plan === 'pro') {
    return Infinity
  }

  // Free users are limited to 3 notes
  const remaining = FREE_TIER_NOTE_LIMIT - noteCount
  return Math.max(0, remaining)
}

export async function isProUser(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.plan === 'pro' || false
}

export async function getUserPlan(userId: string): Promise<'free' | 'pro' | null> {
  const profile = await getUserProfile(userId)
  return profile?.plan || null
}

export function getNoteLimitForPlan(plan: 'free' | 'pro'): number {
  return plan === 'pro' ? Infinity : FREE_TIER_NOTE_LIMIT
}