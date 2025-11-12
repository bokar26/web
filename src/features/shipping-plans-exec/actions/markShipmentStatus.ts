'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { log } from '../data/audit'

interface MarkShipmentBookedRequest {
  shipmentId: string
  ownerUserId: string
}

interface MarkShipmentDeliveredRequest {
  shipmentId: string
  ownerUserId: string
}

/**
 * Mark shipment as booked
 */
export async function markShipmentBooked(request: MarkShipmentBookedRequest) {
  const { shipmentId, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    throw new Error('User ID mismatch')
  }

  const supabase = createServerClient()

  // Get current shipment to check status
  const { data: currentShipment } = await supabase
    .from('shipments')
    .select('status')
    .eq('id', shipmentId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (!currentShipment) {
    throw new Error('Shipment not found')
  }

  const previousStatus = currentShipment.status

  // Update shipment status
  const { data: shipment, error } = await supabase
    .from('shipments')
    .update({ status: 'booked', updated_at: new Date().toISOString() })
    .eq('id', shipmentId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[markShipmentBooked] Failed to update shipment:', error)
    throw new Error(`Failed to update shipment: ${error.message}`)
  }

  if (!shipment) {
    throw new Error('Shipment not found')
  }

  // Log audit
  await log(ownerUserId, 'shipment', shipmentId, 'status_updated', undefined, {
    status: 'booked',
    previous_status: previousStatus,
  })

  return { success: true, shipment }
}

/**
 * Mark shipment as delivered
 */
export async function markShipmentDelivered(request: MarkShipmentDeliveredRequest) {
  const { shipmentId, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    throw new Error('User ID mismatch')
  }

  const supabase = createServerClient()

  // Get current shipment to check status
  const { data: currentShipment } = await supabase
    .from('shipments')
    .select('status')
    .eq('id', shipmentId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (!currentShipment) {
    throw new Error('Shipment not found')
  }

  const previousStatus = currentShipment.status

  // Update shipment status
  const { data: shipment, error } = await supabase
    .from('shipments')
    .update({
      status: 'delivered',
      updated_at: new Date().toISOString(),
      // Optionally set actual delivery date
      eta_actual: new Date().toISOString(),
    })
    .eq('id', shipmentId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[markShipmentDelivered] Failed to update shipment:', error)
    throw new Error(`Failed to update shipment: ${error.message}`)
  }

  if (!shipment) {
    throw new Error('Shipment not found')
  }

  // Log audit
  await log(ownerUserId, 'shipment', shipmentId, 'status_updated', undefined, {
    status: 'delivered',
    previous_status: previousStatus,
  })

  return { success: true, shipment }
}

