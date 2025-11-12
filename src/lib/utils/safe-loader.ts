/**
 * Safe data loader utility for Supabase queries
 * 
 * Wraps Supabase queries with error handling and returns typed results
 * instead of throwing errors. This prevents cascading failures and allows
 * graceful error handling in UI components.
 */

import { SupabaseClient } from '@supabase/supabase-js'

export interface SafeLoadResult<T> {
  data: T | null
  error: string | null
  success: boolean
}

/**
 * Safely execute a Supabase query with error handling
 * 
 * @param queryFn - Function that returns a Supabase query promise
 * @param context - Context string for error logging (e.g., "loadForecasts")
 * @returns Safe result with data or error
 */
export async function safeLoad<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  context: string = 'unknown'
): Promise<SafeLoadResult<T>> {
  try {
    const result = await queryFn()

    if (result.error) {
      // Handle RLS errors gracefully
      if (result.error.code === 'PGRST301' || result.error.message?.includes('RLS')) {
        console.warn(`[safeLoader] RLS error in ${context}:`, result.error.message)
        return {
          data: null,
          error: 'Access denied. You may not have permission to view this data.',
          success: false,
        }
      }

      // Handle other Supabase errors
      console.error(`[safeLoader] Query error in ${context}:`, result.error)
      return {
        data: null,
        error: result.error.message || 'Failed to load data',
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
    console.error(`[safeLoader] Unexpected error in ${context}:`, error)
    return {
      data: null,
      error: error.message || 'An unexpected error occurred',
      success: false,
    }
  }
}

/**
 * Safely execute multiple Supabase queries in parallel
 * 
 * @param queries - Array of query functions
 * @param context - Context string for error logging
 * @returns Array of safe results
 */
export async function safeLoadMany<T>(
  queries: Array<() => Promise<{ data: T | null; error: any }>>,
  context: string = 'unknown'
): Promise<Array<SafeLoadResult<T>>> {
  const results = await Promise.all(
    queries.map((queryFn, index) => safeLoad(queryFn, `${context}[${index}]`))
  )
  return results
}

/**
 * Validate Supabase client before use
 * 
 * @param client - Supabase client to validate
 * @returns True if client is valid, false otherwise
 */
export function validateSupabaseClient(client: SupabaseClient | null): client is SupabaseClient {
  if (!client) {
    console.warn('[safeLoader] Supabase client is null or undefined')
    return false
  }
  return true
}

/**
 * Safe wrapper for Supabase select queries
 * 
 * @param client - Supabase client
 * @param table - Table name
 * @param select - Select query builder function
 * @param context - Context for error logging
 * @returns Safe result with data or error
 */
export async function safeSelect<T>(
  client: SupabaseClient | null,
  table: string,
  select: (query: any) => any,
  context: string = 'unknown'
): Promise<SafeLoadResult<T[]>> {
  if (!validateSupabaseClient(client)) {
    return {
      data: null,
      error: 'Database connection not available',
      success: false,
    }
  }

  return safeLoad(
    async () => {
      const query = client.from(table).select('*')
      const builtQuery = select(query)
      return builtQuery
    },
    `${context}(select from ${table})`
  )
}

/**
 * Safe wrapper for Supabase insert operations
 * 
 * @param client - Supabase client
 * @param table - Table name
 * @param insert - Insert query builder function
 * @param context - Context for error logging
 * @returns Safe result with data or error
 */
export async function safeInsert<T>(
  client: SupabaseClient | null,
  table: string,
  insert: (query: any) => any,
  context: string = 'unknown'
): Promise<SafeLoadResult<T>> {
  if (!validateSupabaseClient(client)) {
    return {
      data: null,
      error: 'Database connection not available',
      success: false,
    }
  }

  return safeLoad(
    async () => {
      const query = client.from(table).insert({})
      const builtQuery = insert(query)
      return builtQuery.select().single()
    },
    `${context}(insert into ${table})`
  )
}

/**
 * Safe wrapper for Supabase update operations
 * 
 * @param client - Supabase client
 * @param table - Table name
 * @param update - Update query builder function
 * @param context - Context for error logging
 * @returns Safe result with data or error
 */
export async function safeUpdate<T>(
  client: SupabaseClient | null,
  table: string,
  update: (query: any) => any,
  context: string = 'unknown'
): Promise<SafeLoadResult<T>> {
  if (!validateSupabaseClient(client)) {
    return {
      data: null,
      error: 'Database connection not available',
      success: false,
    }
  }

  return safeLoad(
    async () => {
      const query = client.from(table).update({})
      const builtQuery = update(query)
      return builtQuery.select().single()
    },
    `${context}(update ${table})`
  )
}

