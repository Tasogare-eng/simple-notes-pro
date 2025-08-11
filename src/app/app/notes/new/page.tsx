import NoteForm from '@/components/notes/NoteForm'
import { createNoteAction } from '@/app/app/actions'
import Link from 'next/link'

export default function NewNotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/app"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mr-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Notes
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Create New Note</h1>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NoteForm
            action={createNoteAction}
            submitText="Create Note"
            cancelUrl="/app"
          />
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'New Note - Simple Notes Pro',
  description: 'Create a new note',
}