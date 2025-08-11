'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Note } from '@/types/database'

interface NoteFormProps {
  note?: Note
  action: (formData: FormData) => Promise<{ error?: string; upgradeRequired?: boolean } | void>
  submitText: string
  cancelUrl: string
}

export default function NoteForm({ note, action, submitText, cancelUrl }: NoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [upgradeRequired, setUpgradeRequired] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    setUpgradeRequired(false)

    try {
      const result = await action(formData)
      
      if (result?.error) {
        setError(result.error)
        setUpgradeRequired(result.upgradeRequired || false)
      }
      // If successful, the action will redirect
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            maxLength={200}
            defaultValue={note?.title || ''}
            className={cn(
              "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500"
            )}
            placeholder="Enter note title..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={12}
            required
            defaultValue={note?.content || ''}
            className={cn(
              "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500 resize-vertical"
            )}
            placeholder="Write your note content here..."
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className={cn(
            "p-4 rounded-md",
            upgradeRequired 
              ? "bg-blue-50 border border-blue-200"
              : "bg-red-50 border border-red-200"
          )}>
            <div className="flex">
              <div className="ml-3">
                <p className={cn(
                  "text-sm",
                  upgradeRequired ? "text-blue-800" : "text-red-800"
                )}>
                  {error}
                </p>
                {upgradeRequired && (
                  <div className="mt-3">
                    <a
                      href="/billing"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Upgrade to Pro
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <a
            href={cancelUrl}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white",
              "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </div>
  )
}