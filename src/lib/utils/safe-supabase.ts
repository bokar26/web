/**
 * Safe Supabase wrapper utilities
 * 
 * Provides safe wrappers for Supabase operations that handle
 * errors gracefully and return typed results instead of throwing.
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@/lib/supabase/server'

export interface SafeSupabaseResult<T> {
  data: T | null
  error: string | null
  success: boolean
}

/**
 * Safely get a Supabase client with validation
 * 
 * @returns Client if available, null otherwise
 */
export function getSafeSupabaseClient(): SupabaseClient | null {
  try {
    const client = createServerClient()
    if (!client) {
      console.warn('[safeSupabase] Supabase client creation returned null')
      return null
    }
    return client
  } catch (error: any) {
    console.error('[safeSupabase] Failed to create Supabase client:', error)
    return null
  }
}

/**
 * Safely execute a Supabase query with error handling
 * 
 * @param queryFn - Function that executes a Supabase query
 * @param context - Context string for error logging
 * @returns Safe result with data or error
 */
export async function safeSupabaseQuery<T>(
  queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>,
  context: string = 'unknown'
): Promise<SafeSupabaseResult<T>> {
  const client = getSafeSupabaseClient()
  
  if (!client) {
    return {
      data: null,
      error: 'Database connection not available',
      success: false,
    }
  }

  try {
    const result = await queryFn(client)

    if (result.error) {
      // Handle RLS errors gracefully
      if (result.error.code === 'PGRST301' || result.error.message?.includes('RLS')) {
        console.warn(`[safeSupabase] RLS error in ${context}:`, result.error.message)
        return {
          data: null,
          error: 'Access denied. You may not have permission to view this data.',
          success: false,
        }
      }

      // Handle other Supabase errors
      console.error(`[safeSupabase] Query error in ${context}:`, result.error)
      return {
        data: null,
        error: result.error.message || 'Failed to execute query',
        success: false,
      }
    }

    return {
      data: result.data,
      error: null,
      success: true,
    }
  } catch (error: any) {
    // Handle unexpected errors (network, parsing, etc.)
    console.error(`[safeSupabase] Unexpected error in ${context}:`, error)
    return {
      data: null,
      error: error.message || 'An unexpected error occurred',
      success: false,
    }
  }
}

/**
 * Validate that a Supabase client is available and ready
 * 
 * @param client - Supabase client to validate
 * @returns True if client is valid, false otherwise
 */
export function isValidSupabaseClient(client: SupabaseClient | null): client is SupabaseClient {
  if (!client) {
    return false
  }
  
  // Additional validation could check client configuration here
  return true
}

