interface PlanComparisonProps {
  currentPlan?: 'free' | 'pro'
}

export default function PlanComparison({ currentPlan }: PlanComparisonProps) {
  const features = [
    {
      name: 'Notes',
      free: '3 notes maximum',
      pro: 'Unlimited notes',
      icon: '📝'
    },
    {
      name: 'Create & Edit',
      free: 'Full editing capabilities',
      pro: 'Full editing capabilities',
      icon: '✏️'
    },
    {
      name: 'Storage',
      free: 'Secure cloud storage',
      pro: 'Secure cloud storage',
      icon: '☁️'
    },
    {
      name: 'Support',
      free: 'Email support',
      pro: 'Priority support',
      icon: '💬'
    },
    {
      name: 'Features',
      free: 'Basic features',
      pro: 'Advanced features',
      icon: '⚡'
    },
    {
      name: 'Price',
      free: '¥0 per month',
      pro: '¥500 per month',
      icon: '💰'
    }
  ]

  return (
    <div className="overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        Plan Comparison
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Feature
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 relative">
                <div className={`rounded-t-lg p-2 ${
                  currentPlan === 'free' ? 'bg-blue-100' : 'bg-gray-50'
                }`}>
                  Free Plan
                  {currentPlan === 'free' && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 relative">
                <div className={`rounded-t-lg p-2 ${
                  currentPlan === 'pro' ? 'bg-green-100' : 'bg-gradient-to-r from-blue-50 to-blue-100'
                }`}>
                  Pro Plan
                  {currentPlan === 'pro' ? (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  ) : (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((feature) => (
              <tr key={feature.name} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">{feature.icon}</span>
                    <span className="font-medium text-gray-900">{feature.name}</span>
                  </div>
                </td>
                <td className={`px-4 py-4 text-sm text-center ${
                  currentPlan === 'free' ? 'bg-blue-25' : ''
                }`}>
                  <span className="text-gray-700">{feature.free}</span>
                </td>
                <td className={`px-4 py-4 text-sm text-center ${
                  currentPlan === 'pro' ? 'bg-green-25' : 'bg-blue-25'
                }`}>
                  <div className="flex items-center justify-center">
                    <span className={`font-medium ${
                      feature.name === 'Notes' || feature.name === 'Support' || feature.name === 'Features'
                        ? 'text-blue-700' 
                        : 'text-gray-700'
                    }`}>
                      {feature.pro}
                    </span>
                    {(feature.name === 'Notes' || feature.name === 'Support' || feature.name === 'Features') && (
                      <svg className="ml-1 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>All plans include secure cloud storage and data encryption</span>
        </div>
      </div>

      {currentPlan !== 'pro' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <h4 className="font-medium text-blue-900 mb-2">
              Ready to upgrade?
            </h4>
            <p className="text-sm text-blue-800 mb-3">
              Join thousands of users who have upgraded to Pro for unlimited notes and priority support.
            </p>
            <div className="text-xs text-blue-600">
              • 30-day money-back guarantee • Cancel anytime • Secure payment with Stripe
            </div>
          </div>
        </div>
      )}
    </div>
  )
}