'use server'

import { auth } from '@clerk/nextjs/server'
import {
  UpsertCostRequest,
  UpsertCostResponse,
} from '../types'
import { getShipment } from '../data/shipments'
import { upsertCost, listCostsForShipment } from '../data/costs'
import { createException, listExceptionsForShipment } from '../data/exceptions'
import { THRESHOLDS } from '../constants'
import { log } from '../data/audit'

/**
 * Record planned or actual cost and evaluate shipment-level variance exceptions
 */
export async function upsertCostAction(
  request: UpsertCostRequest
): Promise<UpsertCostResponse> {
  const { shipmentId, cost, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[shipping/upsertCost] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[shipping/upsertCost] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get shipment
    const shipment = await getShipment(ownerUserId, shipmentId)
    if (!shipment) {
      console.error('[shipping/upsertCost] Shipment not found:', shipmentId)
      throw new Error('Shipment not found')
    }

    // Upsert cost
    const savedCost = await upsertCost(shipmentId, cost.id, {
      cost_type: cost.costType,
      planned_amount: cost.plannedAmount || null,
      actual_amount: cost.actualAmount || null,
      currency: cost.currency,
    })

    // Calculate shipment-level variance
    const allCosts = await listCostsForShipment(shipmentId)
    const plannedTotal = allCosts.reduce((sum, c) => sum + (Number(c.planned_amount) || 0), 0)
    const actualTotal = allCosts.reduce((sum, c) => sum + (Number(c.actual_amount) || 0), 0)
    
    // Calculate variance percentage
    let variancePct = 0
    if (plannedTotal > 0) {
      variancePct = ((actualTotal - plannedTotal) / plannedTotal) * 100
    }

    // Check for shipment-level variance exception
    let exception = undefined
    let exceptionRaised = false

    if (plannedTotal > 0 && Math.abs(variancePct) >= THRESHOLDS.COST_VARIANCE_PERCENT) {
      // Check if unresolved variance exception already exists
      const existingExceptions = await listExceptionsForShipment(shipmentId, {
        resolved: false,
        type: 'cost_variance',
      })

      if (existingExceptions.length === 0) {
        // Create new exception
        exception = await createException(shipmentId, {
          exception_type: 'cost_variance',
          severity: Math.abs(variancePct) >= 15 ? 'high' : 'medium',
          message: `Shipment cost variance of ${variancePct.toFixed(1)}% (planned $${plannedTotal.toFixed(2)} → actual $${actualTotal.toFixed(2)}) exceeds threshold of ${THRESHOLDS.COST_VARIANCE_PERCENT}%`,
          threshold_value: THRESHOLDS.COST_VARIANCE_PERCENT,
          actual_value: Math.abs(variancePct),
        })

        exceptionRaised = true

        // Log exception creation
        await log(ownerUserId, 'exception', exception.id, 'created', undefined, {
          shipment_id: shipmentId,
          exception_type: 'cost_variance',
          severity: exception.severity,
          variance_pct: variancePct,
          planned_total: plannedTotal,
          actual_total: actualTotal,
        })
      } else {
        // Exception already exists
        exception = existingExceptions[0]
        exceptionRaised = true
      }
    }

    // Log cost update with shipment-level variance
    await log(ownerUserId, 'cost', savedCost.id, cost.id ? 'updated' : 'created',
      cost.id ? { cost_type: cost.costType } : undefined,
      {
        cost_type: cost.costType,
        variance_pct: savedCost.variance_pct,
        shipment_variance_pct: variancePct,
        planned_total: plannedTotal,
        actual_total: actualTotal,
      }
    )

    return {
      cost: savedCost,
      exception,
      plannedTotal,
      actualTotal,
      variancePct,
      exceptionRaised,
    }
  } catch (error) {
    console.error('[shipping/upsertCost] Error:', error)
    throw error instanceof Error ? error : new Error('Failed to upsert cost')
  }
}

