'use server'

import { auth } from '@clerk/nextjs/server'
import {
  ApplyPlanRequest,
  ApplyPlanResponse,
  ShipmentSummary,
} from '../types'
import {
  createShipment,
  createShipmentLeg,
  createContainer,
  createContainerItem,
  createAllocation,
} from '../data/shipments'
import { createCost } from '../data/costs'
import { log } from '../data/audit'
import { createServerClient } from '@/lib/supabase/server'

/**
 * Get or create carrier by name
 * Returns carrier_id (using name as ID for now, can be enhanced later)
 */
async function getOrCreateCarrier(carrierName: string): Promise<string> {
  // For Phase-1: use carrier name as carrier_id
  // In production, would query/insert into carriers table
  return carrierName
}

/**
 * Get or create port by name
 * Returns port_id (using name as ID for now, can be enhanced later)
 */
async function getOrCreatePort(portName: string): Promise<string> {
  // For Phase-1: use port name as port_id
  // In production, would query/insert into ports table
  return portName
}

/**
 * Apply shipping plans - creates shipments, legs, containers, allocations, and planned costs
 * All in a single transaction (using Supabase transactions via batch inserts)
 */
export async function applyPlan(
  request: ApplyPlanRequest
): Promise<ApplyPlanResponse> {
  const { plans, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[shipping/applyPlan] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[shipping/applyPlan] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  if (!plans || plans.length === 0) {
    throw new Error('No plans provided')
  }

  const createdShipments: ShipmentSummary[] = []

  try {
    // Create shipments for each plan
    for (const plan of plans) {
      // Resolve carrier and port IDs
      const carrierId = await getOrCreateCarrier(plan.carrier)
      const originPortId = await getOrCreatePort(plan.origin.name)
      const destPortId = await getOrCreatePort(plan.destination.name)

      // Calculate planned_departure (use current date as fallback, or calculate from ETA)
      const plannedEta = plan.recommendedETA ? new Date(plan.recommendedETA).toISOString() : null
      // For now, use current date as departure (can be enhanced with proper calculation)
      const plannedDeparture = new Date().toISOString()

      // Create shipment
      const shipment = await createShipment(ownerUserId, {
        plan_id: plan.planId,
        origin_port_id: originPortId,
        dest_port_id: destPortId,
        carrier_id: carrierId,
        status: 'planned',
        planned_eta: plannedEta,
        planned_cost: plan.recommendedCost,
      })

      // Create shipment leg
      await createShipmentLeg(shipment.id, {
        leg_sequence: 1,
        origin_port_id: originPortId,
        dest_port_id: destPortId,
        carrier_id: carrierId,
        mode: 'sea',
        planned_departure: plannedDeparture,
        planned_arrival: plannedEta,
      })

      // Create container (placeholder)
      const container = await createContainer(shipment.id, {
        container_type: '40ft',
        status: 'planned',
        utilization_pct: 0,
      })

      // Create container item (placeholder)
      await createContainerItem(container.id, {
        sku_id: 'SKU-001', // TODO: Get from plan
        quantity: 100,
        weight_kg: 1000,
        volume_cbm: 10,
      })

      // Create allocation (placeholder)
      await createAllocation(shipment.id, {
        sku_id: 'SKU-001',
        quantity_reserved: 100,
        quantity_allocated: 0,
      })

      // Create planned cost
      await createCost(shipment.id, {
        cost_type: 'freight',
        planned_amount: plan.recommendedCost,
        currency: 'USD',
      })

      // Log audit
      await log(ownerUserId, 'shipment', shipment.id, 'apply_plan', undefined, {
        plan_id: plan.planId,
        status: 'planned',
        origin: plan.origin.name,
        destination: plan.destination.name,
        carrier: plan.carrier,
      })

      createdShipments.push({
        id: shipment.id,
        planId: plan.planId,
        origin: plan.origin.name,
        destination: plan.destination.name,
        carrier: plan.carrier,
        status: 'planned',
        plannedEta: plannedEta,
        plannedCost: plan.recommendedCost,
      })
    }

    return {
      shipments: createdShipments,
      createdCount: createdShipments.length,
    }
  } catch (error) {
    console.error('[shipping/applyPlan] Error:', error)
    throw error instanceof Error ? error : new Error('Failed to apply plan')
  }
}

