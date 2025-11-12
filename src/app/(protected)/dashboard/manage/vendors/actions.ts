'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { SupabaseVendor, SaveVendorParams, SaveVendorResult, ListVendorsParams, ListVendorsResult, VendorSource } from '@/types/vendors'
import { mapSupplierToVendor, mapLogisticsToVendor, mapWarehouseToVendor } from '@/lib/adapters/vendors'

/**
 * Server action to save a vendor from a supplier/warehouse/logistics listing
 * Upserts by (owner_user_id, source, source_id) to prevent duplicates
 */
export async function saveVendor(
  params: SaveVendorParams
): Promise<SaveVendorResult> {
  try {
    const { source, sourceId, ownerUserId, row } = params

    // Get authenticated user ID from Clerk
    const { userId } = await auth()
    if (!userId) {
      console.error('[saveVendor] User not authenticated')
      return {
        upserted: false,
        vendorId: '',
        wasInsert: false,
        error: 'User not authenticated',
      }
    }

    // Ensure ownerUserId matches authenticated user
    if (ownerUserId !== userId) {
      console.error('[saveVendor] User ID mismatch', { ownerUserId, userId })
      return {
        upserted: false,
        vendorId: '',
        wasInsert: false,
        error: 'User ID mismatch',
      }
    }

    // Map row to vendor fields based on source
    let vendorData: Omit<SupabaseVendor, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
    
    if (source === 'supplier') {
      vendorData = mapSupplierToVendor(row as any, sourceId)
    } else if (source === 'logistics') {
      vendorData = mapLogisticsToVendor(row as any, sourceId)
    } else if (source === 'warehouse') {
      vendorData = mapWarehouseToVendor(row as any, sourceId)
    } else {
      console.error('[saveVendor] Unknown source:', source)
      return {
        upserted: false,
        vendorId: '',
        wasInsert: false,
        error: `Unknown source: ${source}`,
      }
    }

    const supabase = createServerClient()
    if (!supabase) {
      console.error('[saveVendor] Failed to create Supabase client')
      return {
        upserted: false,
        vendorId: '',
        wasInsert: false,
        error: 'Database connection failed',
      }
    }

    // Check if vendor already exists
    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('owner_user_id', ownerUserId)
      .eq('source', source)
      .eq('source_id', sourceId)
      .maybeSingle()

    const wasInsert = !existing

    // Prepare upsert data
    const upsertData = {
      ...vendorData,
      owner_user_id: ownerUserId,
      updated_at: new Date().toISOString(),
    }

    // Upsert vendor record using onConflict with unique constraint
    // Note: Supabase upsert requires matching the unique constraint columns
    const { data, error } = await supabase
      .from('vendors')
      .upsert(upsertData, {
        onConflict: 'owner_user_id,source,source_id',
      })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation as success (already saved)
      if (error.code === '23505') {
        // Unique constraint violation - vendor already exists
        return {
          upserted: true,
          vendorId: existing?.id || '',
          wasInsert: false,
        }
      }
      // Include PostgREST error code in console for debugging
      console.error('[saveVendor] Supabase upsert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      return {
        upserted: false,
        vendorId: '',
        wasInsert: false,
        error: `Failed to save vendor: ${error.message}${error.code ? ` (code: ${error.code})` : ''}`,
      }
    }

    // Minimal diagnostics (dev-only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[saveVendor]', {
        source,
        sourceId,
        wasInsert: wasInsert,
        vendorId: data?.id,
      })
    }

    return {
      upserted: true,
      vendorId: data?.id || '',
      wasInsert: wasInsert,
    }
  } catch (err: any) {
    console.error('[saveVendor] Unexpected error:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
    })
    return {
      upserted: false,
      vendorId: '',
      wasInsert: false,
      error: err?.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Server action to list vendors for the current user with pagination, search, and filtering
 */
export async function listVendors(
  params: ListVendorsParams
): Promise<ListVendorsResult> {
  try {
    const { ownerUserId, page = 1, pageSize = 25, q, status } = params

    // Validate params
    if (!ownerUserId || typeof ownerUserId !== 'string') {
      console.error('[vendors/listVendors] Invalid ownerUserId:', ownerUserId)
      return {
        data: [],
        total: 0,
        hasMore: false,
        error: 'Invalid user ID',
      }
    }

    // Get authenticated user ID from Clerk
    let userId: string | null = null
    try {
      const authResult = await auth()
      userId = authResult.userId
    } catch (authErr: any) {
      console.error('[vendors/listVendors] Auth error:', authErr)
      return {
        data: [],
        total: 0,
        hasMore: false,
        error: `Authentication failed: ${authErr?.message || 'Unknown error'}`,
      }
    }

    if (!userId) {
      console.error('[vendors/listVendors] User not authenticated')
      return {
        data: [],
        total: 0,
        hasMore: false,
        error: 'User not authenticated',
      }
    }

    // Ensure ownerUserId matches authenticated user
    if (ownerUserId !== userId) {
      console.error('[vendors/listVendors] User ID mismatch', { ownerUserId, userId })
      return {
        data: [],
        total: 0,
        hasMore: false,
        error: 'User ID mismatch',
      }
    }

    // Create Supabase client
    let supabase
    try {
      supabase = createServerClient()
      if (!supabase) {
        throw new Error('Failed to create Supabase client')
      }
    } catch (supabaseErr: any) {
      console.error('[vendors/listVendors] Supabase client creation error:', supabaseErr)
      return {
        data: [],
        total: 0,
        hasMore: false,
        error: `Database connection failed: ${supabaseErr?.message || 'Unknown error'}`,
      }
    }

    const offset = (page - 1) * pageSize

    // Build base query with count
    let query = supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('owner_user_id', ownerUserId)

    // Apply text search on name (case-insensitive)
    // Start with name search only for reliability; can expand to multiple fields later
    if (q && q.trim()) {
      query = query.ilike('name', `%${q.trim()}%`)
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    // Apply sorting: default created_at desc (newest first)
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[vendors/listVendors] Supabase query error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      
      // Provide more helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return {
          data: [],
          total: 0,
          hasMore: false,
          error: `Vendors table not found. Please ensure the table exists and the Supabase schema cache has been refreshed. Error: ${error.message}`,
        }
      }
      
      return {
        data: [],
        total: 0,
        hasMore: false,
        error: `Failed to fetch vendors: ${error.message}${error.code ? ` (code: ${error.code})` : ''}`,
      }
    }

    const total = count || 0
    const hasMore = (offset + (data?.length || 0)) < total

    // Minimal diagnostics (dev-only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[vendors/listVendors] Success:', {
        ownerUserId,
        q: q || '(empty)',
        totalCount: total,
        dataLength: data?.length || 0,
      })
    }

    return {
      data: (data || []) as SupabaseVendor[],
      total,
      hasMore,
    }
  } catch (err: any) {
    // Enhanced error logging
    console.error('[vendors/listVendors] Error:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
      params: params ? { ...params, ownerUserId: params.ownerUserId ? '***' : undefined } : undefined,
    })
    // Return error result instead of throwing
    return {
      data: [],
      total: 0,
      hasMore: false,
      error: err?.message || 'An unexpected error occurred',
    }
  }
}

