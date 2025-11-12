/**
 * Warehouses data service
 * CRUD operations for warehouses
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseWarehouse, Warehouse } from '../types'

/**
 * Create a warehouse
 */
export async function createWarehouse(
  ownerUserId: string,
  data: Omit<SupabaseWarehouse, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseWarehouse> {
  const supabase = createServerClient()

  const { data: warehouse, error } = await supabase
    .from('warehouses')
    .insert({
      ...data,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/warehouses] Failed to create warehouse:', error)
    throw new Error(`Failed to create warehouse: ${error.message}`)
  }

  return warehouse as SupabaseWarehouse
}

/**
 * Get warehouse by ID
 */
export async function getWarehouse(
  ownerUserId: string,
  warehouseId: string
): Promise<Warehouse | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', warehouseId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (error || !data) {
    return null
  }

  return data as Warehouse
}

/**
 * List warehouses for owner
 */
export async function listWarehouses(ownerUserId: string): Promise<Warehouse[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('name', { ascending: true })

  if (error) {
    console.error('[inventory/warehouses] Failed to list warehouses:', error)
    return []
  }

  return (data || []) as Warehouse[]
}

/**
 * Update warehouse
 */
export async function updateWarehouse(
  ownerUserId: string,
  warehouseId: string,
  data: Partial<Omit<SupabaseWarehouse, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseWarehouse> {
  const supabase = createServerClient()

  const { data: warehouse, error } = await supabase
    .from('warehouses')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', warehouseId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[inventory/warehouses] Failed to update warehouse:', error)
    throw new Error(`Failed to update warehouse: ${error.message}`)
  }

  return warehouse as SupabaseWarehouse
}

/**
 * Delete warehouse
 */
export async function deleteWarehouse(
  ownerUserId: string,
  warehouseId: string
): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('warehouses')
    .delete()
    .eq('id', warehouseId)
    .eq('owner_user_id', ownerUserId)

  if (error) {
    console.error('[inventory/warehouses] Failed to delete warehouse:', error)
    throw new Error(`Failed to delete warehouse: ${error.message}`)
  }
}

