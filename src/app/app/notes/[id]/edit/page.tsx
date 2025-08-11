import { getAuthenticatedUser } from '@/lib/utils/auth'
import { getNoteById } from '@/lib/queries/notes'
import { updateNoteAction } from '@/app/app/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NoteForm from '@/components/notes/NoteForm'

interface EditNotePageProps {
  params: Promise<{ id: string }>
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  
  const note = await getNoteById(id, user.id)
  
  if (!note) {
    notFound()
  }

  const updateAction = async (formData: FormData) => {
    'use server'
    return updateNoteAction(note.id, formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href={`/app/notes/${note.id}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mr-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Note
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Edit Note</h1>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NoteForm
            note={note}
            action={updateAction}
            submitText="Save Changes"
            cancelUrl={`/app/notes/${note.id}`}
          />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: EditNotePageProps) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  const note = await getNoteById(id, user.id)
  
  return {
    title: note ? `Edit: ${note.title} - Simple Notes Pro` : 'Note Not Found',
    description: note ? `Edit note: ${note.title}` : 'Note not found',
  }
}