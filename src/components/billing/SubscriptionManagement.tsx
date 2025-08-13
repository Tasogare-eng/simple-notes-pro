'use client'

import { useState } from 'react'
import { openCustomerPortal } from '@/app/billing/actions'
import type { Profile } from '@/types/database'

interface SubscriptionManagementProps {
  profile: Profile
}

export default function SubscriptionManagement({ profile }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleManageSubscription() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await openCustomerPortal()
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = result.url
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const subscriptionStatusColor = {
    active: 'text-green-800 bg-green-100',
    trialing: 'text-blue-800 bg-blue-100',
    past_due: 'text-yellow-800 bg-yellow-100',
    canceled: 'text-red-800 bg-red-100',
    incomplete: 'text-gray-800 bg-gray-100',
    incomplete_expired: 'text-red-800 bg-red-100',
    unpaid: 'text-red-800 bg-red-100',
  }

  const statusColor = profile.subscription_status 
    ? subscriptionStatusColor[profile.subscription_status as keyof typeof subscriptionStatusColor] || 'text-gray-800 bg-gray-100'
    : 'text-gray-800 bg-gray-100'

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Subscription Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your Pro subscription and billing details
            </p>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {profile.subscription_status 
              ? profile.subscription_status.charAt(0).toUpperCase() + profile.subscription_status.slice(1)
              : 'Unknown'
            }
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Plan</h3>
            <p className="text-2xl font-bold text-blue-600">Pro Plan</p>
            <p className="text-sm text-gray-600">¥500 per month</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Next Billing</h3>
            <p className="text-lg font-semibold text-gray-900">Automatic</p>
            <p className="text-sm text-gray-600">Managed through Stripe</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            What you can manage:
          </h3>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-sm text-gray-700">
              <svg className="flex-shrink-0 h-4 w-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Update payment method and billing information
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <svg className="flex-shrink-0 h-4 w-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              View and download invoices
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <svg className="flex-shrink-0 h-4 w-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel or pause your subscription
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <svg className="flex-shrink-0 h-4 w-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Update billing frequency and preferences
            </li>
          </ul>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Opening Portal...
              </>
            ) : (
              'Manage Subscription'
            )}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            You&apos;ll be redirected to our secure billing portal powered by Stripe
          </p>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Cancellation Policy
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  If you cancel your subscription, you&apos;ll continue to have Pro access until the end of your current billing period. 
                  After that, your account will revert to the Free plan with a 3-note limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}