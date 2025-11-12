/**
 * Milestones data service
 * CRUD operations for milestones
 */

import { createServerClient } from '@/lib/supabase/server'
import {
  SupabaseMilestone,
  Milestone,
  MilestoneStatus,
} from '../types'

/**
 * Create a milestone
 */
export async function createMilestone(
  shipmentId: string,
  data: Omit<SupabaseMilestone, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseMilestone> {
  const supabase = createServerClient()

  const { data: milestone, error } = await supabase
    .from('milestones')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create milestone:', error)
    throw new Error(`Failed to create milestone: ${error.message}`)
  }

  return milestone as SupabaseMilestone
}

/**
 * Get milestone by ID
 */
export async function getMilestone(milestoneId: string): Promise<SupabaseMilestone | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('id', milestoneId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SupabaseMilestone
}

/**
 * List milestones for shipment
 */
export async function listMilestonesForShipment(
  shipmentId: string,
  options?: {
    status?: MilestoneStatus
  }
): Promise<SupabaseMilestone[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('milestones')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('planned_date', { ascending: true, nullsFirst: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to list milestones:', error)
    throw new Error(`Failed to list milestones: ${error.message}`)
  }

  return (data || []) as SupabaseMilestone[]
}

/**
 * Update milestone
 */
export async function updateMilestone(
  milestoneId: string,
  updates: Partial<Omit<SupabaseMilestone, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseMilestone> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('milestones')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', milestoneId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update milestone:', error)
    throw new Error(`Failed to update milestone: ${error.message}`)
  }

  return data as SupabaseMilestone
}

/**
 * Upsert milestone (create or update)
 */
export async function upsertMilestone(
  shipmentId: string,
  milestoneId: string | undefined,
  data: Omit<SupabaseMilestone, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseMilestone> {
  if (milestoneId) {
    return updateMilestone(milestoneId, data)
  } else {
    return createMilestone(shipmentId, data)
  }
}

