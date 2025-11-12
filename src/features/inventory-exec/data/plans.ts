/**
 * Replenishment plans data service
 * CRUD operations for replenishment_plans
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseReplenishmentPlan, ReplenishmentPlan, PlanStatus } from '../types'

/**
 * Create or update replenishment plan
 */
export async function upsertPlan(
  ownerUserId: string,
  data: Omit<SupabaseReplenishmentPlan, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseReplenishmentPlan> {
  const supabase = createServerClient()

  const { data: plan, error } = await supabase
    .from('replenishment_plans')
    .upsert({
      ...data,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/plans] Failed to upsert plan:', error)
    throw new Error(`Failed to upsert plan: ${error.message}`)
  }

  return plan as SupabaseReplenishmentPlan
}

/**
 * Get plan by ID
 */
export async function getPlan(
  ownerUserId: string,
  planId: string
): Promise<ReplenishmentPlan | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('replenishment_plans')
    .select('*')
    .eq('id', planId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (error || !data) {
    return null
  }

  return data as ReplenishmentPlan
}

/**
 * List plans for owner
 */
export async function listPlans(
  ownerUserId: string,
  options?: {
    skuId?: string
    warehouseId?: string
    status?: PlanStatus
    limit?: number
  }
): Promise<ReplenishmentPlan[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('replenishment_plans')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('created_at', { ascending: false })

  if (options?.skuId) {
    query = query.eq('sku_id', options.skuId)
  }

  if (options?.warehouseId) {
    query = query.eq('warehouse_id', options.warehouseId)
  }

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/plans] Failed to list plans:', error)
    return []
  }

  return (data || []) as ReplenishmentPlan[]
}

/**
 * Update plan status
 */
export async function updatePlanStatus(
  ownerUserId: string,
  planId: string,
  status: PlanStatus
): Promise<SupabaseReplenishmentPlan> {
  const supabase = createServerClient()

  const { data: plan, error } = await supabase
    .from('replenishment_plans')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', planId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[inventory/plans] Failed to update plan status:', error)
    throw new Error(`Failed to update plan status: ${error.message}`)
  }

  return plan as SupabaseReplenishmentPlan
}

