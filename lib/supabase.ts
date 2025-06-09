import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export types for TypeScript support
export type { Database } from './database.types'

// Utility function to check if client is properly configured
export async function validateSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('log').select('count').limit(1)
    if (error) {
      console.warn('Supabase connection test failed:', error.message)
      return false
    }
    return true
  } catch (error) {
    console.warn('Supabase connection test error:', error)
    return false
  }
} 