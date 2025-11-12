/**
 * Shipments data service
 * CRUD operations for shipments, legs, containers, allocations
 */

import { createServerClient } from '@/lib/supabase/server'
import {
  SupabaseShipment,
  SupabaseShipmentLeg,
  SupabaseContainer,
  SupabaseContainerItem,
  SupabaseAllocation,
  Shipment,
  ShipmentStatus,
} from '../types'

/**
 * Create a shipment
 */
export async function createShipment(
  ownerUserId: string,
  data: Omit<SupabaseShipment, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseShipment> {
  const supabase = createServerClient()

  const { data: shipment, error } = await supabase
    .from('shipments')
    .insert({
      ...data,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create shipment:', error)
    throw new Error(`Failed to create shipment: ${error.message}`)
  }

  return shipment as SupabaseShipment
}

/**
 * Get shipment by ID (with related data)
 */
export async function getShipment(
  ownerUserId: string,
  shipmentId: string
): Promise<Shipment | null> {
  const supabase = createServerClient()

  // Get shipment
  const { data: shipment, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('id', shipmentId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (error || !shipment) {
    return null
  }

  // Get related data
  const [legsResult, containersResult, allocationsResult] = await Promise.all([
    supabase
      .from('shipment_legs')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('leg_sequence', { ascending: true }),
    supabase
      .from('containers')
      .select('*')
      .eq('shipment_id', shipmentId),
    supabase
      .from('allocations')
      .select('*')
      .eq('shipment_id', shipmentId),
  ])

  // Get container items for each container
  const containers = containersResult.data || []
  const containerItemsPromises = containers.map((container) =>
    supabase
      .from('container_items')
      .select('*')
      .eq('container_id', container.id)
  )

  const containerItemsResults = await Promise.all(containerItemsPromises)

  return {
    ...shipment,
    legs: legsResult.data as SupabaseShipmentLeg[],
    containers: containers.map((container, idx) => ({
      ...container,
      items: containerItemsResults[idx].data as SupabaseContainerItem[],
    })),
    allocations: allocationsResult.data as SupabaseAllocation[],
  } as Shipment
}

/**
 * List shipments for owner
 */
export async function listShipments(
  ownerUserId: string,
  options?: {
    status?: ShipmentStatus
    limit?: number
    offset?: number
  }
): Promise<SupabaseShipment[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('shipments')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to list shipments:', error)
    throw new Error(`Failed to list shipments: ${error.message}`)
  }

  return (data || []) as SupabaseShipment[]
}

/**
 * Update shipment
 */
export async function updateShipment(
  ownerUserId: string,
  shipmentId: string,
  updates: Partial<Omit<SupabaseShipment, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseShipment> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('shipments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', shipmentId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update shipment:', error)
    throw new Error(`Failed to update shipment: ${error.message}`)
  }

  return data as SupabaseShipment
}

/**
 * Create shipment leg
 */
export async function createShipmentLeg(
  shipmentId: string,
  data: Omit<SupabaseShipmentLeg, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseShipmentLeg> {
  const supabase = createServerClient()

  const { data: leg, error } = await supabase
    .from('shipment_legs')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create shipment leg:', error)
    throw new Error(`Failed to create shipment leg: ${error.message}`)
  }

  return leg as SupabaseShipmentLeg
}

/**
 * Create container
 */
export async function createContainer(
  shipmentId: string,
  data: Omit<SupabaseContainer, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseContainer> {
  const supabase = createServerClient()

  const { data: container, error } = await supabase
    .from('containers')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create container:', error)
    throw new Error(`Failed to create container: ${error.message}`)
  }

  return container as SupabaseContainer
}

/**
 * Create container item
 */
export async function createContainerItem(
  containerId: string,
  data: Omit<SupabaseContainerItem, 'id' | 'container_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseContainerItem> {
  const supabase = createServerClient()

  const { data: item, error } = await supabase
    .from('container_items')
    .insert({
      ...data,
      container_id: containerId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create container item:', error)
    throw new Error(`Failed to create container item: ${error.message}`)
  }

  return item as SupabaseContainerItem
}

/**
 * Create allocation
 */
export async function createAllocation(
  shipmentId: string,
  data: Omit<SupabaseAllocation, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseAllocation> {
  const supabase = createServerClient()

  const { data: allocation, error } = await supabase
    .from('allocations')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create allocation:', error)
    throw new Error(`Failed to create allocation: ${error.message}`)
  }

  return allocation as SupabaseAllocation
}

/**
 * Get aggregated KPI data for shipments
 * Returns safe zero values when no data exists
 */
export interface ShipmentKPIData {
  totalShipments: number
  bookedShipments: number
  totalPlannedCost: number
  avgTransitDays: number
}

export async function listShipmentsForKPIs(
  ownerUserId: string
): Promise<ShipmentKPIData> {
  const supabase = createServerClient()

  // Query all shipments for owner
  const { data: shipments, error: shipmentsError } = await supabase
    .from('shipments')
    .select('id, status, planned_cost')
    .eq('owner_user_id', ownerUserId)

  // Only log errors when error is truthy (not for empty results)
  if (shipmentsError) {
    console.error('[shipping/listShipmentsForKPIs] Query error:', shipmentsError)
    // Return zeros on error to prevent UI crashes
    return {
      totalShipments: 0,
      bookedShipments: 0,
      totalPlannedCost: 0,
      avgTransitDays: 0,
    }
  }

  const shipmentList = shipments || []

  // Calculate aggregations safely
  const totalShipments = shipmentList.length
  const bookedShipments = shipmentList.filter((s) => s.status === 'booked').length
  const totalPlannedCost = shipmentList.reduce((sum, s) => sum + (Number(s.planned_cost) || 0), 0)

  // Calculate avg transit days from shipment_legs (planned_departure -> planned_arrival)
  let avgTransitDays = 0
  if (shipmentList.length > 0) {
    const shipmentIds = shipmentList.map((s) => s.id)
    
    // Query legs for all shipments
    const { data: legs, error: legsError } = await supabase
      .from('shipment_legs')
      .select('planned_departure, planned_arrival')
      .in('shipment_id', shipmentIds)
      .not('planned_departure', 'is', null)
      .not('planned_arrival', 'is', null)

    if (legsError) {
      console.error('[shipping/listShipmentsForKPIs] Legs query error:', legsError)
      // Continue with avgTransitDays = 0 if legs query fails
    } else if (legs && legs.length > 0) {
      // Calculate transit days for each leg
      const transitDays = legs
        .map((leg) => {
          if (leg.planned_departure && leg.planned_arrival) {
            const departure = new Date(leg.planned_departure).getTime()
            const arrival = new Date(leg.planned_arrival).getTime()
            const days = (arrival - departure) / (1000 * 60 * 60 * 24)
            return days > 0 ? days : 0
          }
          return null
        })
        .filter((days): days is number => days !== null)

      if (transitDays.length > 0) {
        avgTransitDays = transitDays.reduce((sum, days) => sum + days, 0) / transitDays.length
      }
    }
  }

  return {
    totalShipments,
    bookedShipments,
    totalPlannedCost,
    avgTransitDays,
  }
}

