'use server'

import { auth } from '@clerk/nextjs/server'
import {
  GenerateReplenishmentPlansRequest,
  GenerateReplenishmentPlansResponse,
} from '../types'
import { listPolicies } from '../data/policies'
import { listForecasts, calculateAvgDailyDemandFromForecasts } from '../data/forecasts'
import { getLatestSnapshot } from '../data/snapshots'
import { calculateAvgDailyDemand } from '../data/transactions'
import { upsertPlan } from '../data/plans'
import { log } from '../data/audit'
import { EXCEPTION_THRESHOLDS } from '../constants'

/**
 * Generate replenishment plans for all SKUs with policies
 * Calculates SS, DLT, ROP, and recommended quantities
 */
export async function generateReplenishmentPlans(
  request: GenerateReplenishmentPlansRequest
): Promise<GenerateReplenishmentPlansResponse> {
  const { horizonDays, reviewPolicy, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/generateReplenishmentPlans] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/generateReplenishmentPlans] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get all policies for owner
    const policies = await listPolicies(ownerUserId)

    if (policies.length === 0) {
      return { planIds: [], count: 0 }
    }

    const planIds: string[] = []

    // Process each policy
    for (const policy of policies) {
      try {
        // Calculate average daily demand
        let avgDailyDemand = 0
        const forecastDemand = await calculateAvgDailyDemandFromForecasts(
          ownerUserId,
          policy.sku_id,
          policy.warehouse_id,
          horizonDays
        )

        if (forecastDemand > 0) {
          avgDailyDemand = forecastDemand
        } else {
          // Fallback to transaction history
          avgDailyDemand = await calculateAvgDailyDemand(
            ownerUserId,
            policy.sku_id,
            policy.warehouse_id,
            horizonDays
          )
        }

        // Calculate safety stock (SS)
        let safetyStock = policy.safety_stock || 0
        if (policy.method === 'ss-dlt' && policy.service_level_pct) {
          // Simplified: use fixed safety_stock if provided, otherwise calculate
          // For full implementation, would calculate: service_level_factor * stdev * sqrt(lead_time)
          if (!safetyStock && avgDailyDemand > 0) {
            // Placeholder calculation - in production would use actual stdev
            const serviceLevelFactor = policy.service_level_pct / 100 // Simplified
            safetyStock = Math.ceil(serviceLevelFactor * avgDailyDemand * Math.sqrt(policy.lead_time_days))
          }
        }

        // Calculate demand during lead time (DLT)
        const dlt = avgDailyDemand * policy.lead_time_days

        // Calculate reorder point (ROP)
        const calculatedROP = safetyStock + dlt
        const reorderPoint = policy.reorder_point || calculatedROP
        const rop = Math.max(reorderPoint, calculatedROP)

        // Get latest snapshot
        const snapshot = await getLatestSnapshot(
          ownerUserId,
          policy.sku_id,
          policy.warehouse_id
        )

        // Calculate net inventory
        const onHand = snapshot?.on_hand || 0
        const reserved = snapshot?.reserved || 0
        const onOrder = snapshot?.on_order || 0
        const net = onHand - reserved + onOrder

        // Calculate recommended quantity
        let recommendedQty = Math.max(0, rop - net)

        // Round to lot multiple
        const lotMultiple = policy.lot_multiple || 1
        if (recommendedQty > 0 && lotMultiple > 1) {
          recommendedQty = Math.ceil(recommendedQty / lotMultiple) * lotMultiple
        }

        // Apply MOQ
        const moq = policy.moq || 0
        if (recommendedQty > 0 && moq > 0) {
          recommendedQty = Math.max(recommendedQty, moq)
        }

        // Only create plan if recommended quantity > 0
        if (recommendedQty > 0) {
          // Calculate days of supply (DoS) for priority
          const daysOfSupply = avgDailyDemand > 0 ? net / avgDailyDemand : 999
          let priority: 'low' | 'medium' | 'high' = 'low'
          if (daysOfSupply < 15) {
            priority = 'high'
          } else if (daysOfSupply < 30) {
            priority = 'medium'
          }

          // Create plan
          const plan = await upsertPlan(ownerUserId, {
            sku_id: policy.sku_id,
            warehouse_id: policy.warehouse_id,
            recommended_qty: recommendedQty,
            priority,
            status: 'new',
            reason_json: {
              avgDailyDemand,
              safetyStock,
              dlt,
              rop,
              net,
              onHand,
              reserved,
              onOrder,
              daysOfSupply: Math.round(daysOfSupply * 10) / 10,
            },
          })

          planIds.push(plan.id)

          // Check for exceptions
          if (onHand < safetyStock * EXCEPTION_THRESHOLDS.STOCKOUT_RISK_MULTIPLIER) {
            // Would create exception here - placeholder for now
            console.warn(`[inventory/generateReplenishmentPlans] Stockout risk for ${policy.sku_id}`)
          }
        }
      } catch (error) {
        console.error(`[inventory/generateReplenishmentPlans] Error processing policy for ${policy.sku_id}:`, error)
        // Continue with next policy
      }
    }

    // Audit log
    await log(
      ownerUserId,
      'replenishment_plans',
      'bulk',
      'generate_replenishment',
      undefined,
      { count: planIds.length, horizonDays }
    )

    return {
      planIds,
      count: planIds.length,
    }
  } catch (error) {
    console.error('[inventory/generateReplenishmentPlans] Error:', error)
    throw new Error(`Failed to generate replenishment plans: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

