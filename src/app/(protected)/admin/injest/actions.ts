'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { vendorCreateSchema } from './schemas'
import type { AdminVendorCreate, BulkVendorRow, BulkUploadResult, VendorCountResult } from '@/types/vendors'

// Generate UUID for source_id
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Create a single vendor manually
 */
export async function createVendor(
  params: AdminVendorCreate
): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  try {
    // Validate input
    const validated = vendorCreateSchema.parse(params)

    // Get authenticated user ID from Clerk
    const { userId } = await auth()
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
      }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return {
        success: false,
        error: 'Database connection failed',
      }
    }

    // Generate unique source_id for admin-created vendor
    const sourceId = generateUUID()

    // Prepare vendor data
    const vendorData = {
      owner_user_id: userId,
      source: 'admin' as const,
      source_id: sourceId,
      name: validated.name,
      category: validated.category || null,
      location: validated.location || null,
      email: validated.email || null,
      phone: validated.phone || null,
      website: validated.website || null,
      notes: validated.notes || null,
      payload: params.payload || null, // Store custom fields in payload JSONB
      is_admin_created: true,
      status: 'saved' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Insert vendor
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendorData)
      .select('id')
      .single()

    if (error) {
      console.error('[createVendor] Supabase insert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
      })
      return {
        success: false,
        error: `Failed to create vendor: ${error.message}`,
      }
    }

    return {
      success: true,
      vendorId: data?.id,
    }
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return {
        success: false,
        error: `Validation error: ${err.errors.map((e: any) => e.message).join(', ')}`,
      }
    }
    console.error('[createVendor] Unexpected error:', err)
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Bulk create vendors from parsed CSV/XLSX data
 */
export async function bulkCreateVendors(
  vendors: BulkVendorRow[]
): Promise<BulkUploadResult> {
  try {
    // Get authenticated user ID from Clerk
    const { userId } = await auth()
    if (!userId) {
      return {
        total: 0,
        inserted: 0,
        skipped: 0,
        errors: [],
        error: 'User not authenticated',
      }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return {
        total: 0,
        inserted: 0,
        skipped: 0,
        errors: [],
        error: 'Database connection failed',
      }
    }

    const total = vendors.length
    const errors: Array<{ rowNumber: number; message: string }> = []
    const validVendors: Array<{
      owner_user_id: string
      source: 'admin'
      source_id: string
      name: string
      category: string | null
      location: string | null
      email: string | null
      phone: string | null
      website: string | null
      notes: string | null
      is_admin_created: boolean
      status: 'saved'
      created_at: string
      updated_at: string
    }> = []

    // Validate and prepare each vendor
    for (const vendor of vendors) {
      try {
        const validated = vendorCreateSchema.parse(vendor)
        const sourceId = generateUUID()

        validVendors.push({
          owner_user_id: userId,
          source: 'admin',
          source_id: sourceId,
          name: validated.name,
          category: validated.category || null,
          location: validated.location || null,
          email: validated.email || null,
          phone: validated.phone || null,
          website: validated.website || null,
          notes: validated.notes || null,
          is_admin_created: true,
          status: 'saved',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } catch (validationErr: any) {
        if (validationErr.name === 'ZodError') {
          errors.push({
            rowNumber: vendor.rowNumber || 0,
            message: validationErr.errors.map((e: any) => e.message).join(', '),
          })
        } else {
          errors.push({
            rowNumber: vendor.rowNumber || 0,
            message: validationErr?.message || 'Validation failed',
          })
        }
      }
    }

    // Check for duplicates by name + email (normalized)
    const seen = new Set<string>()
    const duplicates: number[] = []
    const deduplicatedVendors = validVendors.filter((vendor, index) => {
      const key = `${(vendor.name || '').toLowerCase().trim()}_${(vendor.email || '').toLowerCase().trim()}`
      if (seen.has(key)) {
        duplicates.push(vendors[index]?.rowNumber || index + 1)
        return false
      }
      seen.add(key)
      return true
    })

    // Batch insert valid vendors (Supabase supports up to 1000 rows per insert)
    let inserted = 0
    const batchSize = 1000
    for (let i = 0; i < deduplicatedVendors.length; i += batchSize) {
      const batch = deduplicatedVendors.slice(i, i + batchSize)
      const { error: insertError } = await supabase
        .from('vendors')
        .insert(batch)

      if (insertError) {
        console.error('[bulkCreateVendors] Batch insert error:', insertError)
        // Add batch errors to errors array
        batch.forEach((_, batchIndex) => {
          errors.push({
            rowNumber: i + batchIndex + 1,
            message: `Failed to insert: ${insertError.message}`,
          })
        })
      } else {
        inserted += batch.length
      }
    }

    const skipped = duplicates.length

    return {
      total,
      inserted,
      skipped,
      errors,
    }
  } catch (err: any) {
    console.error('[bulkCreateVendors] Unexpected error:', err)
    return {
      total: vendors.length,
      inserted: 0,
      skipped: 0,
      errors: [],
      error: err?.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Get total vendor count in database
 */
export async function getVendorCount(): Promise<VendorCountResult> {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return {
        totalVendors: 0,
        error: 'Database connection failed',
      }
    }

    const { count, error } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('[getVendorCount] Supabase query error:', error)
      return {
        totalVendors: 0,
        error: `Failed to fetch vendor count: ${error.message}`,
      }
    }

    return {
      totalVendors: count || 0,
    }
  } catch (err: any) {
    console.error('[getVendorCount] Unexpected error:', err)
    return {
      totalVendors: 0,
      error: err?.message || 'An unexpected error occurred',
    }
  }
}

