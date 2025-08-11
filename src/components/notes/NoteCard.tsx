import type { Note } from '@/types/database'
import Link from 'next/link'
import DeleteNoteButton from './DeleteNoteButton'

interface NoteCardProps {
  note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
  // Truncate content for preview
  const contentPreview = note.content.length > 100 
    ? note.content.substring(0, 100) + '...' 
    : note.content

  // Format date
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/app/notes/${note.id}`} className="block group">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {note.title}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-gray-600 leading-5">
              {contentPreview}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <DeleteNoteButton noteId={note.id} noteTitle={note.title} />
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formattedDate}
          </span>
          <div className="flex space-x-2">
            <Link
              href={`/app/notes/${note.id}`}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View
            </Link>
            <Link
              href={`/app/notes/${note.id}/edit`}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}