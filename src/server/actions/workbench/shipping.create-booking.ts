'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface CreateShippingBookingParams {
  originPortId?: string
  destinationPortId?: string
  freightForwarderId?: string
  carrierId?: string
  legs: Array<{
    origin: string
    destination: string
    estimatedDeparture?: string
    estimatedArrival?: string
  }>
  containers?: Array<{
    containerType: string
    items: Array<{
      skuId: string
      quantity: number
    }>
  }>
}

export interface CreateShippingBookingResult {
  shipmentId: string
  legCount: number
  containerCount: number
}

/**
 * Create shipment with legs, milestones, and optional containers
 */
export async function createShippingBooking(
  params: CreateShippingBookingParams
): Promise<ActionResult<CreateShippingBookingResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Create shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .insert({
        owner_user_id: userId,
        status: 'draft',
        freight_forwarder_id: params.freightForwarderId || null,
        carrier_id: params.carrierId || null,
        origin_port_id: params.originPortId || null,
        destination_port_id: params.destinationPortId || null,
      })
      .select()
      .single()

    if (shipmentError || !shipment) {
      return { ok: false, error: shipmentError?.message || 'Failed to create shipment' }
    }

    // Create shipment legs
    const legs = params.legs.map((leg, index) => ({
      shipment_id: shipment.id,
      leg_sequence: index + 1,
      origin: leg.origin,
      destination: leg.destination,
      estimated_departure: leg.estimatedDeparture || null,
      estimated_arrival: leg.estimatedArrival || null,
    }))

    const { error: legsError } = await supabase.from('shipment_legs').insert(legs)

    if (legsError) {
      return { ok: false, error: legsError.message || 'Failed to create shipment legs' }
    }

    // Create milestones for each leg
    const milestones = legs.flatMap((leg, legIndex) => [
      {
        shipment_id: shipment.id,
        leg_id: legIndex + 1,
        milestone_type: 'departure',
        scheduled_at: leg.estimated_departure,
      },
      {
        shipment_id: shipment.id,
        leg_id: legIndex + 1,
        milestone_type: 'arrival',
        scheduled_at: leg.estimated_arrival,
      },
    ])

    if (milestones.length > 0) {
      const { error: milestonesError } = await supabase
        .from('shipment_milestones')
        .insert(milestones)

      if (milestonesError) {
        console.warn('[shipping.create-booking] Failed to create milestones:', milestonesError)
      }
    }

    // Create containers and container items if provided
    let containerCount = 0
    if (params.containers && params.containers.length > 0) {
      for (const container of params.containers) {
        const { data: containerRecord, error: containerError } = await supabase
          .from('containers')
          .insert({
            shipment_id: shipment.id,
            container_type: container.containerType,
          })
          .select()
          .single()

        if (containerError || !containerRecord) {
          console.warn('[shipping.create-booking] Failed to create container:', containerError)
          continue
        }

        containerCount++

        // Create container items
        const containerItems = container.items.map((item) => ({
          container_id: containerRecord.id,
          sku_id: item.skuId,
          quantity: item.quantity,
        }))

        const { error: itemsError } = await supabase
          .from('container_items')
          .insert(containerItems)

        if (itemsError) {
          console.warn('[shipping.create-booking] Failed to create container items:', itemsError)
        }
      }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'shipment',
      entityId: shipment.id,
      action: 'create',
      afterState: { legCount: legs.length, containerCount },
    })

    return {
      ok: true,
      data: {
        shipmentId: shipment.id,
        legCount: legs.length,
        containerCount,
      },
    }
  } catch (error: any) {
    console.error('[shipping.create-booking] Error:', error)
    return { ok: false, error: error.message || 'Failed to create shipping booking' }
  }
}

