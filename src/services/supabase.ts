import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos das tabelas
export interface Team {
  id: string
  name: string
  description: string
  location: string
  created_at: string
}

export interface ChecklistItem {
  id: string
  team_id: string
  label: string
  checked: boolean
  checked_at: string | null
}