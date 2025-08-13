'use client'

import { useState } from 'react'

export default function SyncSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  async function handleSync() {
    setIsLoading(true)
    setMessage(null)
    setIsError(false)

    try {
      const response = await fetch('/api/sync-subscription', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage(`Subscription synced successfully. Plan: ${data.plan}`)
        setIsError(false)
        // Refresh the page after 2 seconds to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setMessage(data.error || 'Sync failed')
        setIsError(true)
      }
    } catch (error) {
      console.error('Sync error:', error)
      setMessage('Network error occurred')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-yellow-800 mb-2">
        Subscription Status Issue?
      </h4>
      <p className="text-xs text-yellow-700 mb-3">
        If you&apos;ve completed payment but your plan hasn&apos;t updated, click the button below to sync your subscription status.
      </p>
      
      {message && (
        <div className={`mb-3 p-2 rounded text-xs ${
          isError 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSync}
        disabled={isLoading}
        className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium py-2 px-3 rounded transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Syncing...
          </>
        ) : (
          '🔄 Sync Subscription'
        )}
      </button>
    </div>
  )
}