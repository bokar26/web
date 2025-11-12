'use server'

import { auth } from '@clerk/nextjs/server'
import { listShipmentsForKPIs, ShipmentKPIData } from '../data/shipments'

/**
 * Server action to get KPI data for shipments
 * Enforces owner_user_id scoping via auth
 */
export async function getShipmentKPIs(): Promise<ShipmentKPIData> {
  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  try {
    return await listShipmentsForKPIs(userId)
  } catch (error) {
    console.error('[shipping/getShipmentKPIs] Error:', error)
    // Return zeros on error to prevent UI crashes
    return {
      totalShipments: 0,
      bookedShipments: 0,
      totalPlannedCost: 0,
      avgTransitDays: 0,
    }
  }
}

