import { getAuthenticatedUser } from '@/lib/utils/auth'
import { getUserNotes, getUserNoteCount } from '@/lib/queries/notes'
import { getUserProfile } from '@/lib/queries/profiles'
import SignOutButton from '@/components/auth/SignOutButton'
import NotesList from '@/components/notes/NotesList'
import NoteLimitBanner from '@/components/notes/NoteLimitBanner'
import Link from 'next/link'

export default async function AppPage() {
  const user = await getAuthenticatedUser()
  
  const [notes, noteCount, profile] = await Promise.all([
    getUserNotes(user.id),
    getUserNoteCount(user.id),
    getUserProfile(user.id)
  ])

  const plan = profile?.plan || 'free'
  const isFreePlan = plan === 'free'
  const hasReachedLimit = isFreePlan && noteCount >= 3

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Simple Notes Pro</h1>
              <p className="text-sm text-gray-500">
                {plan === 'pro' ? '✨ プロプラン' : '📝 無料プラン'} - {noteCount} {noteCount === 1 ? '件のメモ' : '件のメモ'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/billing"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                お支払い
              </Link>
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Upgrade Banner for Free Users Near Limit */}
          {isFreePlan && noteCount >= 2 && (
            <div className="mb-6">
              <NoteLimitBanner 
                noteCount={noteCount} 
                plan={plan} 
                hasReachedLimit={hasReachedLimit}
              />
            </div>
          )}

          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">あなたのメモ</h2>
              <p className="text-gray-600">
                アイデアや考えを整理しましょう
              </p>
            </div>
            <div className="space-x-3">
              {hasReachedLimit ? (
                <Link
                  href="/billing"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  プロにアップグレード
                </Link>
              ) : (
                <Link
                  href="/app/notes/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新しいメモ
                </Link>
              )}
            </div>
          </div>

          {/* Notes List */}
          <NotesList notes={notes} />
        </div>
      </div>
    </div>
  )
}