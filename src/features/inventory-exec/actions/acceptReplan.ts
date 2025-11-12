'use server'

import { auth } from '@clerk/nextjs/server'
import {
  AcceptReplanRequest,
  AcceptReplanResponse,
  POCreateRequest,
  TransferCreateRequest,
} from '../types'
import { updatePlanStatus, getPlan } from '../data/plans'
import { log } from '../data/audit'

/**
 * Accept replenishment plan and return staged PO/Transfer DTOs
 */
export async function acceptReplan(
  request: AcceptReplanRequest
): Promise<AcceptReplanResponse> {
  const { planId, split, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/acceptReplan] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/acceptReplan] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get plan
    const plan = await getPlan(ownerUserId, planId)
    if (!plan) {
      throw new Error('Plan not found')
    }

    // Update status
    await updatePlanStatus(ownerUserId, planId, 'accepted')

    // Calculate splits if provided
    let poRequest: POCreateRequest | undefined
    let transferRequest: TransferCreateRequest | undefined

    if (split) {
      const poPct = split.poPct || 0
      const transferPct = split.transferPct || 0
      const totalPct = poPct + transferPct

      if (totalPct > 0 && totalPct <= 100) {
        if (poPct > 0) {
          // Would need supplier_id from plan or user input - placeholder
          poRequest = {
            supplier_id: '', // Would be provided by UI
            lines: [{
              sku_id: plan.sku_id,
              qty: Math.round(plan.recommended_qty * (poPct / 100)),
              price: 0, // Would be provided by UI
              warehouse_id: plan.warehouse_id,
              promised_date: undefined,
            }],
          }
        }

        if (transferPct > 0) {
          // Would need from_warehouse_id from plan or user input - placeholder
          transferRequest = {
            from_warehouse_id: '', // Would be provided by UI
            to_warehouse_id: plan.warehouse_id,
            lines: [{
              sku_id: plan.sku_id,
              qty: Math.round(plan.recommended_qty * (transferPct / 100)),
            }],
          }
        }
      }
    }

    // Audit log
    await log(
      ownerUserId,
      'replenishment_plans',
      planId,
      'accept_replan',
      { status: plan.status },
      { status: 'accepted', split }
    )

    return {
      po: poRequest,
      transfer: transferRequest,
    }
  } catch (error) {
    console.error('[inventory/acceptReplan] Error:', error)
    throw new Error(`Failed to accept plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

