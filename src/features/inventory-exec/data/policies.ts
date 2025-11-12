/**
 * Reorder policies data service
 * CRUD operations for reorder_policies
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseReorderPolicy, ReorderPolicy } from '../types'

/**
 * Create or update reorder policy
 */
export async function upsertPolicy(
  ownerUserId: string,
  data: Omit<SupabaseReorderPolicy, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseReorderPolicy> {
  const supabase = createServerClient()

  const { data: policy, error } = await supabase
    .from('reorder_policies')
    .upsert({
      ...data,
      owner_user_id: ownerUserId,
    }, {
      onConflict: 'owner_user_id,sku_id,warehouse_id',
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/policies] Failed to upsert policy:', error)
    throw new Error(`Failed to upsert policy: ${error.message}`)
  }

  return policy as SupabaseReorderPolicy
}

/**
 * Get policy for SKU/warehouse
 */
export async function getPolicy(
  ownerUserId: string,
  skuId: string,
  warehouseId: string
): Promise<ReorderPolicy | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('reorder_policies')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .eq('sku_id', skuId)
    .eq('warehouse_id', warehouseId)
    .single()

  if (error || !data) {
    return null
  }

  return data as ReorderPolicy
}

/**
 * List all policies for owner
 */
export async function listPolicies(ownerUserId: string): Promise<ReorderPolicy[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('reorder_policies')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('sku_id', { ascending: true })

  if (error) {
    console.error('[inventory/policies] Failed to list policies:', error)
    return []
  }

  return (data || []) as ReorderPolicy[]
}

/**
 * Delete policy
 */
export async function deletePolicy(
  ownerUserId: string,
  policyId: string
): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('reorder_policies')
    .delete()
    .eq('id', policyId)
    .eq('owner_user_id', ownerUserId)

  if (error) {
    console.error('[inventory/policies] Failed to delete policy:', error)
    throw new Error(`Failed to delete policy: ${error.message}`)
  }
}

