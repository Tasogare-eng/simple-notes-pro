import Link from 'next/link'

interface NoteLimitBannerProps {
  noteCount: number
  plan: 'free' | 'pro'
  hasReachedLimit: boolean
}

export default function NoteLimitBanner({ noteCount, plan, hasReachedLimit }: NoteLimitBannerProps) {
  if (plan === 'pro') return null

  const remainingNotes = 3 - noteCount
  const isWarning = noteCount === 2
  const isLimit = hasReachedLimit

  return (
    <div className={`rounded-md p-4 ${
      isLimit 
        ? 'bg-red-50 border border-red-200' 
        : isWarning 
          ? 'bg-yellow-50 border border-yellow-200'
          : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {isLimit ? (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : isWarning ? (
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${
            isLimit 
              ? 'text-red-800' 
              : isWarning 
                ? 'text-yellow-800'
                : 'text-blue-800'
          }`}>
            {isLimit 
              ? 'メモの上限に達しました'
              : isWarning 
                ? 'メモの上限が近づいています'
                : '無料プランの制限'
            }
          </h3>
          <div className={`mt-1 text-sm ${
            isLimit 
              ? 'text-red-700' 
              : isWarning 
                ? 'text-yellow-700'
                : 'text-blue-700'
          }`}>
            <p>
              {isLimit 
                ? `無料プランの3件のメモをすべて使用しました。無制限のメモを作成するにはプロにアップグレードしてください。`
                : isWarning 
                  ? `無料プランではあと${remainingNotes}件のメモしか作成できません。無制限のメモを作成するにはプロにアップグレードしてください。`
                  : `無料プランではあと${remainingNotes}件のメモを作成できます。`
              }
            </p>
          </div>
          <div className="mt-3">
            <div className="-mx-2 -my-1.5 flex">
              <Link
                href="/billing"
                className={`px-2 py-1.5 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isLimit 
                    ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'
                    : isWarning 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500'
                }`}
              >
プロにアップグレード - 月額¥500
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}