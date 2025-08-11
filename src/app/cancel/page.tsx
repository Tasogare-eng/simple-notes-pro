import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
          <svg
            className="h-8 w-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          No worries, your payment was cancelled.
        </p>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          No charges were made to your account. You can try upgrading again anytime or continue using the free plan.
        </p>

        <div className="space-y-3">
          <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Continue with Free Plan:</h3>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Up to 3 notes
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                All basic features
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Email support
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 space-x-4">
          <Link
            href="/app"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue with Free Plan
          </Link>
          
          <Link
            href="/billing"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Upgrading Again
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-2">Need help or have questions?</p>
          <a 
            href="mailto:support@simplenotespro.com" 
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Payment Cancelled - Simple Notes Pro',
  description: 'Your payment was cancelled. Continue with the free plan or try upgrading again.',
}