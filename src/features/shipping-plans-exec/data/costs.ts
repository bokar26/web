/**
 * Costs data service
 * CRUD operations for costs
 */

import { createServerClient } from '@/lib/supabase/server'
import {
  SupabaseCost,
  Cost,
} from '../types'

/**
 * Create a cost
 */
export async function createCost(
  shipmentId: string,
  data: Omit<SupabaseCost, 'id' | 'shipment_id' | 'recorded_at' | 'created_at' | 'updated_at'>
): Promise<SupabaseCost> {
  const supabase = createServerClient()

  // Calculate variance if both planned and actual are provided
  let variancePct: number | null = null
  if (data.planned_amount && data.actual_amount && data.planned_amount > 0) {
    variancePct = ((data.actual_amount - data.planned_amount) / data.planned_amount) * 100
  }

  const { data: cost, error } = await supabase
    .from('costs')
    .insert({
      ...data,
      shipment_id: shipmentId,
      variance_pct: variancePct,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create cost:', error)
    throw new Error(`Failed to create cost: ${error.message}`)
  }

  return cost as SupabaseCost
}

/**
 * Get cost by ID
 */
export async function getCost(costId: string): Promise<SupabaseCost | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('costs')
    .select('*')
    .eq('id', costId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SupabaseCost
}

/**
 * List costs for shipment
 */
export async function listCostsForShipment(
  shipmentId: string
): Promise<SupabaseCost[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('costs')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('recorded_at', { ascending: false })

  if (error) {
    console.error('Failed to list costs:', error)
    throw new Error(`Failed to list costs: ${error.message}`)
  }

  return (data || []) as SupabaseCost[]
}

/**
 * Update cost
 */
export async function updateCost(
  costId: string,
  updates: Partial<Omit<SupabaseCost, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseCost> {
  const supabase = createServerClient()

  // Recalculate variance if amounts are updated
  let variancePct = updates.variance_pct
  if (updates.planned_amount !== undefined || updates.actual_amount !== undefined) {
    // Need to get current values to calculate
    const current = await getCost(costId)
    if (current) {
      const planned = updates.planned_amount ?? current.planned_amount
      const actual = updates.actual_amount ?? current.actual_amount
      if (planned && actual && planned > 0) {
        variancePct = ((actual - planned) / planned) * 100
      }
    }
  }

  const { data, error } = await supabase
    .from('costs')
    .update({
      ...updates,
      variance_pct: variancePct,
      updated_at: new Date().toISOString(),
    })
    .eq('id', costId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update cost:', error)
    throw new Error(`Failed to update cost: ${error.message}`)
  }

  return data as SupabaseCost
}

/**
 * Upsert cost (create or update)
 */
export async function upsertCost(
  shipmentId: string,
  costId: string | undefined,
  data: Omit<SupabaseCost, 'id' | 'shipment_id' | 'recorded_at' | 'created_at' | 'updated_at'>
): Promise<SupabaseCost> {
  if (costId) {
    return updateCost(costId, data)
  } else {
    return createCost(shipmentId, data)
  }
}

