/**
 * Stock adjustments data service
 * CRUD operations for stock_adjustments
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseStockAdjustment, StockAdjustment } from '../types'

/**
 * Create stock adjustment
 */
export async function createAdjustment(
  ownerUserId: string,
  data: Omit<SupabaseStockAdjustment, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseStockAdjustment> {
  const supabase = createServerClient()

  const { data: adjustment, error } = await supabase
    .from('stock_adjustments')
    .insert({
      ...data,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/adjustments] Failed to create adjustment:', error)
    throw new Error(`Failed to create adjustment: ${error.message}`)
  }

  return adjustment as SupabaseStockAdjustment
}

/**
 * List adjustments for owner
 */
export async function listAdjustments(
  ownerUserId: string,
  options?: {
    skuId?: string
    warehouseId?: string
    startDate?: string
    endDate?: string
    limit?: number
  }
): Promise<StockAdjustment[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('stock_adjustments')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('created_at', { ascending: false })

  if (options?.skuId) {
    query = query.eq('sku_id', options.skuId)
  }

  if (options?.warehouseId) {
    query = query.eq('warehouse_id', options.warehouseId)
  }

  if (options?.startDate) {
    query = query.gte('created_at', options.startDate)
  }

  if (options?.endDate) {
    query = query.lte('created_at', options.endDate)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/adjustments] Failed to list adjustments:', error)
    return []
  }

  return (data || []) as StockAdjustment[]
}

