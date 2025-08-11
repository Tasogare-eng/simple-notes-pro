import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          Welcome to Simple Notes Pro! ✨
        </p>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Your account has been upgraded to Pro. You now have access to unlimited notes and all Pro features.
        </p>

        <div className="space-y-3">
          <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">What&apos;s included in Pro:</h3>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited notes
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced features
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 space-x-4">
          <Link
            href="/app"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Creating Notes
          </Link>
          
          <Link
            href="/billing"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Manage Subscription
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          Redirecting to your notes in <span id="countdown">10</span> seconds...
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    }>
      <SuccessContent />
      
      {/* Auto-redirect script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            let timeLeft = 10;
            const countdown = document.getElementById('countdown');
            
            const timer = setInterval(() => {
              timeLeft--;
              if (countdown) countdown.textContent = timeLeft;
              
              if (timeLeft <= 0) {
                clearInterval(timer);
                window.location.href = '/app';
              }
            }, 1000);
          `
        }}
      />
    </Suspense>
  )
}

export const metadata = {
  title: 'Payment Successful - Simple Notes Pro',
  description: 'Your payment was successful and your account has been upgraded to Pro.',
}