'use client'

import { useState } from 'react'
import { signUp } from '@/app/auth/actions'
import { cn } from '@/lib/utils/cn'
import SocialSignInButtons from './SocialSignInButtons'

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await signUp(formData)
      
      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else if (result?.success) {
        setMessage({ type: 'success', text: result.message || 'Account created successfully!' })
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          アカウント作成
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          今日からメモの整理を始めましょう
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={cn(
              "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500"
            )}
            placeholder="メールアドレスを入力"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={cn(
              "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500"
            )}
            placeholder="パスワードを作成（最低6文字）"
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            {' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              利用規約
            </a>および{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              プライバシーポリシー
            </a>に同意します
          </label>
        </div>

        {message && (
          <div
            className={cn(
              "p-3 rounded-md text-sm",
              message.type === 'error' 
                ? "bg-red-50 text-red-800 border border-red-200" 
                : "bg-green-50 text-green-800 border border-green-200"
            )}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
            "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            "disabled:bg-gray-400 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              アカウント作成中...
            </>
          ) : (
            'アカウント作成'
          )}
        </button>
      </form>

      {/* Social Sign In */}
      <SocialSignInButtons />

      <div className="text-center text-sm">
        <span className="text-gray-600">すでにアカウントをお持ちですか？</span>{' '}
        <a href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
          ログイン
        </a>
      </div>
    </div>
  )
}