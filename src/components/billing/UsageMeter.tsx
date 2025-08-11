interface UsageMeterProps {
  noteCount: number
  plan: 'free' | 'pro'
}

export default function UsageMeter({ noteCount, plan }: UsageMeterProps) {
  const isProPlan = plan === 'pro'
  const maxNotes = isProPlan ? Infinity : 3
  const usagePercentage = isProPlan ? 0 : Math.min((noteCount / 3) * 100, 100)

  const getProgressColor = () => {
    if (isProPlan) return 'bg-green-500'
    if (usagePercentage >= 100) return 'bg-red-500'
    if (usagePercentage >= 66) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getBackgroundColor = () => {
    if (isProPlan) return 'bg-green-100'
    if (usagePercentage >= 100) return 'bg-red-100'
    if (usagePercentage >= 66) return 'bg-yellow-100'
    return 'bg-blue-100'
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Overview
        </h2>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">
              Notes Created
            </span>
            <span className="text-sm font-medium text-gray-900">
              {noteCount} {isProPlan ? '' : `/ ${maxNotes}`}
            </span>
          </div>
          
          {isProPlan ? (
            <div className="flex items-center">
              <div className="flex-1 bg-green-100 rounded-full h-2 mr-3">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
              <span className="text-sm font-medium text-green-600">Unlimited</span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className={`flex-1 ${getBackgroundColor()} rounded-full h-2 mr-3`}>
                <div 
                  className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${
                usagePercentage >= 100 ? 'text-red-600' : 
                usagePercentage >= 66 ? 'text-yellow-600' : 
                'text-blue-600'
              }`}>
                {Math.round(usagePercentage)}%
              </span>
            </div>
          )}
        </div>

        {!isProPlan && (
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Notes used</span>
              <span className="text-sm font-medium text-gray-900">{noteCount}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Notes remaining</span>
              <span className="text-sm font-medium text-gray-900">{Math.max(0, 3 - noteCount)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Plan limit</span>
              <span className="text-sm font-medium text-gray-900">3 notes</span>
            </div>

            {noteCount >= 3 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Limit Reached
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        You&apos;ve reached your Free plan limit of 3 notes. Upgrade to Pro for unlimited notes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {noteCount === 2 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Almost at your limit
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        You can create 1 more note before reaching your Free plan limit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isProPlan && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Unlimited Access
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    You have unlimited notes with your Pro plan. Create as many as you need!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}