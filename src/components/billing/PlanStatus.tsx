import type { Profile } from '@/types/database'

interface PlanStatusProps {
  profile: Profile
  noteCount: number
}

export default function PlanStatus({ profile, noteCount }: PlanStatusProps) {
  const isPro = profile.plan === 'pro'
  const subscriptionStatusText = profile.subscription_status
    ? profile.subscription_status.charAt(0).toUpperCase() + profile.subscription_status.slice(1)
    : null

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isPro ? '✨ Pro Plan' : '📝 Free Plan'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isPro ? 'You have unlimited access to all features' : 'You have limited access to basic features'}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isPro 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isPro ? 'Pro' : 'Free'}
            </div>
            {isPro && subscriptionStatusText && (
              <p className="text-sm text-gray-500 mt-1">
                Status: {subscriptionStatusText}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Plan</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {isPro ? 'Pro' : 'Free'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Monthly Cost</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {isPro ? '¥500' : '¥0'}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Notes Created</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {noteCount} {isPro ? '(unlimited)' : '(max 3)'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            {isPro ? 'Pro Features' : 'Current Features'}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <svg className={`flex-shrink-0 h-4 w-4 mr-2 ${
                isPro ? 'text-green-500' : 'text-blue-500'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {isPro ? 'Unlimited notes' : 'Up to 3 notes'}
              </span>
            </li>
            <li className="flex items-center text-sm">
              <svg className={`flex-shrink-0 h-4 w-4 mr-2 ${
                isPro ? 'text-green-500' : 'text-blue-500'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Create, edit, and delete notes</span>
            </li>
            <li className="flex items-center text-sm">
              <svg className={`flex-shrink-0 h-4 w-4 mr-2 ${
                isPro ? 'text-green-500' : 'text-blue-500'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {isPro ? 'Priority support' : 'Email support'}
              </span>
            </li>
            {isPro && (
              <li className="flex items-center text-sm">
                <svg className="flex-shrink-0 h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Advanced features</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}