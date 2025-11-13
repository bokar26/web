'use server'

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseFreightForwarder } from '@/types/logistics'

export interface SearchForwardersParams {
  q?: string
  country?: string
  ff_type?: string
  limit?: number
  offset?: number
}

export interface SearchForwardersResult {
  data: SupabaseFreightForwarder[]
  total: number
  hasMore: boolean
}

/**
 * Server action to search freight forwarders from Supabase with pagination
 */
export async function searchForwarders(
  params: SearchForwardersParams
): Promise<SearchForwardersResult> {
  try {
    const { q, country, ff_type, limit = 25, offset = 0 } = params

    const supabase = createServerClient()
    
    // Build base query with count
    let query = supabase
      .from('freight_forwarders')
      .select('*', { count: 'exact' })

    // Apply text search on name
    if (q && q.trim()) {
      query = query.ilike('name', `%${q.trim()}%`)
    }

    // Apply country filter
    if (country) {
      query = query.eq('country_name', country)
    }

    // Apply type filter
    if (ff_type) {
      query = query.eq('ff_type', ff_type)
    }

    // Apply pagination: range and limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase query error:', error)
      // Return empty result instead of throwing
      return {
        data: [],
        total: 0,
        hasMore: false,
      }
    }

    const total = count || 0
    const hasMore = (offset + (data?.length || 0)) < total

    return {
      data: (data || []) as SupabaseFreightForwarder[],
      total,
      hasMore,
    }
  } catch (err) {
    console.error('searchForwarders error:', err)
    // Return empty result instead of throwing to prevent 500 errors
    return {
      data: [],
      total: 0,
      hasMore: false,
    }
  }
}

