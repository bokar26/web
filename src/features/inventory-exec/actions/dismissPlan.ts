'use server'

import { auth } from '@clerk/nextjs/server'
import {
  DismissPlanRequest,
  DismissPlanResponse,
} from '../types'
import { updatePlanStatus } from '../data/plans'
import { log } from '../data/audit'

/**
 * Dismiss a replenishment plan
 */
export async function dismissPlan(
  request: DismissPlanRequest
): Promise<DismissPlanResponse> {
  const { planId, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/dismissPlan] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/dismissPlan] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get current plan state
    const { getPlan } = await import('../data/plans')
    const currentPlan = await getPlan(ownerUserId, planId)

    if (!currentPlan) {
      throw new Error('Plan not found')
    }

    // Update status
    await updatePlanStatus(ownerUserId, planId, 'dismissed')

    // Audit log
    await log(
      ownerUserId,
      'replenishment_plans',
      planId,
      'dismiss_plan',
      { status: currentPlan.status },
      { status: 'dismissed' }
    )

    return { success: true }
  } catch (error) {
    console.error('[inventory/dismissPlan] Error:', error)
    throw new Error(`Failed to dismiss plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

