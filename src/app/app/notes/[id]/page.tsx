import { getAuthenticatedUser } from '@/lib/utils/auth'
import { getNoteById } from '@/lib/queries/notes'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteNoteButton from '@/components/notes/DeleteNoteButton'

interface NoteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  
  const note = await getNoteById(id, user.id)
  
  if (!note) {
    notFound()
  }

  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const updatedDate = new Date(note.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link 
                href="/app"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mr-4"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Notes
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">View Note</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/app/notes/${note.id}/edit`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <DeleteNoteButton noteId={note.id} noteTitle={note.title} />
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {note.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>Created: {formattedDate}</span>
                {note.created_at !== note.updated_at && (
                  <span className="ml-4">Updated: {updatedDate}</span>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                  {note.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: NoteDetailPageProps) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  const note = await getNoteById(id, user.id)
  
  return {
    title: note ? `${note.title} - Simple Notes Pro` : 'Note Not Found',
    description: note ? note.content.substring(0, 160) : 'Note not found',
  }
}