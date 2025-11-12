/**
 * Inventory snapshots data service
 * CRUD operations for inventory_snapshots
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseInventorySnapshot, InventorySnapshot } from '../types'

/**
 * Create or update inventory snapshot
 */
export async function upsertSnapshot(
  ownerUserId: string,
  data: Omit<SupabaseInventorySnapshot, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseInventorySnapshot> {
  const supabase = createServerClient()

  const { data: snapshot, error } = await supabase
    .from('inventory_snapshots')
    .upsert({
      ...data,
      owner_user_id: ownerUserId,
    }, {
      onConflict: 'owner_user_id,date,sku_id,warehouse_id',
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/snapshots] Failed to upsert snapshot:', error)
    throw new Error(`Failed to upsert snapshot: ${error.message}`)
  }

  return snapshot as SupabaseInventorySnapshot
}

/**
 * Get latest snapshot for SKU/warehouse
 */
export async function getLatestSnapshot(
  ownerUserId: string,
  skuId: string,
  warehouseId: string
): Promise<InventorySnapshot | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('inventory_snapshots')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .eq('sku_id', skuId)
    .eq('warehouse_id', warehouseId)
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data as InventorySnapshot
}

/**
 * List snapshots for SKU/warehouse
 */
export async function listSnapshots(
  ownerUserId: string,
  options?: {
    skuId?: string
    warehouseId?: string
    startDate?: string
    endDate?: string
    limit?: number
  }
): Promise<InventorySnapshot[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('inventory_snapshots')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('date', { ascending: false })

  if (options?.skuId) {
    query = query.eq('sku_id', options.skuId)
  }

  if (options?.warehouseId) {
    query = query.eq('warehouse_id', options.warehouseId)
  }

  if (options?.startDate) {
    query = query.gte('date', options.startDate)
  }

  if (options?.endDate) {
    query = query.lte('date', options.endDate)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/snapshots] Failed to list snapshots:', error)
    return []
  }

  return (data || []) as InventorySnapshot[]
}

