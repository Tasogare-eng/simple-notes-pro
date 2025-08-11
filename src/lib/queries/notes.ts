import { createClient } from '@/lib/supabase/server'
import type { Note } from '@/types/database'

type NoteInput = Omit<Note, 'id' | 'created_at' | 'updated_at'>
type NoteUpdate = Partial<Omit<Note, 'id' | 'user_id' | 'created_at'>>

export async function getUserNotes(userId: string): Promise<Note[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user notes:', error)
    return []
  }

  return data || []
}

export async function getUserNoteCount(userId: string): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user note count:', error)
    return 0
  }

  return count || 0
}

export async function getNoteById(noteId: string, userId: string): Promise<Note | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching note:', error)
    return null
  }

  return data
}

export async function createNote(noteData: NoteInput): Promise<Note | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('notes')
    .insert(noteData)
    .select()
    .single()

  if (error) {
    console.error('Error creating note:', error)
    return null
  }

  return data
}

export async function updateNote(
  noteId: string, 
  userId: string,
  updates: NoteUpdate
): Promise<Note | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    return null
  }

  return data
}

export async function deleteNote(noteId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting note:', error)
    return false
  }

  return true
}