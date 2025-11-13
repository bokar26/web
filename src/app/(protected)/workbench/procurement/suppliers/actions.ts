'use server'

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseSupplier } from '@/types/suppliers'

export interface SearchSuppliersParams {
  q?: string
  country?: string
  limit?: number
  offset?: number
}

export interface SearchSuppliersResult {
  data: SupabaseSupplier[]
  total: number
  hasMore: boolean
}

/**
 * Server action to search suppliers from Supabase with pagination
 */
export async function searchSuppliers(
  params: SearchSuppliersParams
): Promise<SearchSuppliersResult> {
  try {
    const { q, country, limit = 25, offset = 0 } = params

    const supabase = createServerClient()
    
    // Build base query with count
    let query = supabase
      .from('suppliers')
      .select('*', { count: 'exact' })

    // Apply text search on name
    if (q && q.trim()) {
      query = query.ilike('supplier_name', `%${q.trim()}%`)
    }

    // Apply country filter
    if (country) {
      query = query.eq('country', country)
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
      data: (data || []) as SupabaseSupplier[],
      total,
      hasMore,
    }
  } catch (err) {
    console.error('searchSuppliers error:', err)
    // Return empty result instead of throwing to prevent 500 errors
    return {
      data: [],
      total: 0,
      hasMore: false,
    }
  }
}

