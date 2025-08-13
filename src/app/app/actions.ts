'use server'

import { createNote, updateNote, deleteNote } from '@/lib/queries/notes'
import { canCreateNote } from '@/lib/utils/planLimits'
import { getAuthenticatedUser } from '@/lib/utils/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
})

export async function createNoteAction(formData: FormData) {
  const user = await getAuthenticatedUser()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // Validate input
  const result = noteSchema.safeParse({ title, content })
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    }
  }

  // Check if user can create more notes (Free tier limit)
  const canCreate = await canCreateNote(user.id)
  if (!canCreate) {
    return {
      error: 'You have reached the maximum number of notes for your plan. Upgrade to Pro for unlimited notes.',
      upgradeRequired: true,
    }
  }

  // Create the note
  const note = await createNote({
    user_id: user.id,
    title: result.data.title,
    content: result.data.content,
  })

  if (!note) {
    return {
      error: 'Failed to create note. Please try again.',
    }
  }

  revalidatePath('/app')
  redirect('/app')
}

export async function updateNoteAction(noteId: string, formData: FormData) {
  const user = await getAuthenticatedUser()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // Validate input
  const result = noteSchema.safeParse({ title, content })
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    }
  }

  // Update the note
  const note = await updateNote(noteId, user.id, {
    title: result.data.title,
    content: result.data.content,
  })

  if (!note) {
    return {
      error: 'Failed to update note. Please try again.',
    }
  }

  revalidatePath('/app')
  revalidatePath(`/app/notes/${noteId}`)
  redirect('/app')
}

export async function deleteNoteAction(noteId: string) {
  const user = await getAuthenticatedUser()

  const success = await deleteNote(noteId, user.id)

  if (!success) {
    return {
      error: 'Failed to delete note. Please try again.',
    }
  }

  revalidatePath('/app')
  redirect('/app')
}