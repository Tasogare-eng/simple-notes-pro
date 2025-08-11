'use client'

import { useState } from 'react'
import { initiateCheckout } from '@/app/billing/actions'
import PlanComparison from './PlanComparison'

interface UpgradeSectionProps {
  noteCount: number
}

export default function UpgradeSection({ noteCount }: UpgradeSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await initiateCheckout()
      
      if (result?.error) {
        setError(result.error)
      }
      // If successful, the action will redirect to Stripe Checkout
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const remainingNotes = Math.max(0, 3 - noteCount)
  const isNearLimit = noteCount >= 2

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upgrade to Pro
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Unlock unlimited notes and premium features
          </p>
          
          {isNearLimit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    {remainingNotes === 0 
                      ? "You've reached your note limit! Upgrade to continue creating notes."
                      : `Only ${remainingNotes} note${remainingNotes === 1 ? '' : 's'} remaining in your Free plan.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">¥500</div>
              <div className="text-blue-100">per month</div>
              <div className="mt-4">
                <span className="bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Upgrade to Pro - ¥500/month'
            )}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Cancel anytime. No setup fees. Secure payment with Stripe.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <PlanComparison currentPlan="free" />
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Why upgrade now?</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Never worry about note limits again
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Get priority support when you need help
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Support continued development of new features
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              30-day money-back guarantee
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}