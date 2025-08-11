import { getAuthenticatedUser } from '@/lib/utils/auth'
import { getUserProfile } from '@/lib/queries/profiles'
import { getUserNoteCount } from '@/lib/queries/notes'
import Link from 'next/link'
import PlanStatus from '@/components/billing/PlanStatus'
import UpgradeSection from '@/components/billing/UpgradeSection'
import SubscriptionManagement from '@/components/billing/SubscriptionManagement'
import UsageMeter from '@/components/billing/UsageMeter'

export default async function BillingPage() {
  const user = await getAuthenticatedUser()
  
  const [profile, noteCount] = await Promise.all([
    getUserProfile(user.id),
    getUserNoteCount(user.id)
  ])

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find your profile. Please try signing in again.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const isPro = profile.plan === 'pro'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link 
                href="/app"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mr-4"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Notes
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Billing & Subscription</h1>
            </div>
            <div className="text-sm text-gray-600">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plan Status */}
            <PlanStatus profile={profile} noteCount={noteCount} />

            {/* Upgrade Section (Free users) or Subscription Management (Pro users) */}
            {isPro ? (
              <SubscriptionManagement profile={profile} />
            ) : (
              <UpgradeSection noteCount={noteCount} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Meter */}
            <UsageMeter noteCount={noteCount} plan={profile.plan} />

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/app"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  📝 Go to Notes
                </Link>
                <Link
                  href="/app/notes/new"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  ➕ Create New Note
                </Link>
                {isPro ? (
                  <button
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => window.open('mailto:support@simplenotespro.com')}
                  >
                    💬 Contact Support
                  </button>
                ) : (
                  <Link
                    href="/billing"
                    className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                  >
                    ✨ Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Have questions about billing or your subscription?
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@simplenotespro.com"
                    className="block text-blue-600 hover:text-blue-500"
                  >
                    📧 Email Support
                  </a>
                  <a
                    href="/help"
                    className="block text-blue-600 hover:text-blue-500"
                  >
                    📚 Help Center
                  </a>
                  <a
                    href="/faq"
                    className="block text-blue-600 hover:text-blue-500"
                  >
                    ❓ FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Billing & Subscription - Simple Notes Pro',
  description: 'Manage your Simple Notes Pro subscription and billing details.',
}