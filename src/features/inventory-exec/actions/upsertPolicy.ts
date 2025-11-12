'use server'

import { auth } from '@clerk/nextjs/server'
import {
  UpsertPolicyRequest,
  UpsertPolicyResponse,
} from '../types'
import { upsertPolicy, getPolicy } from '../data/policies'
import { log } from '../data/audit'

/**
 * Create or update reorder policy
 */
export async function upsertPolicyAction(
  request: UpsertPolicyRequest
): Promise<UpsertPolicyResponse> {
  const {
    sku_id,
    warehouse_id,
    method,
    safety_stock,
    reorder_point,
    reorder_qty,
    lead_time_days,
    review_period_days,
    service_level_pct,
    moq,
    lot_multiple,
    ownerUserId,
  } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/upsertPolicy] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/upsertPolicy] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get current policy if exists
    const currentPolicy = await getPolicy(ownerUserId, sku_id, warehouse_id)

    // Upsert policy
    const policy = await upsertPolicy(ownerUserId, {
      sku_id,
      warehouse_id,
      method: method || 'minmax',
      safety_stock: safety_stock ?? null,
      reorder_point: reorder_point ?? null,
      reorder_qty: reorder_qty ?? null,
      lead_time_days: lead_time_days || 7,
      review_period_days: review_period_days ?? null,
      service_level_pct: service_level_pct ?? null,
      moq: moq ?? null,
      lot_multiple: lot_multiple ?? null,
    })

    // Audit log
    await log(
      ownerUserId,
      'reorder_policies',
      policy.id,
      'policy_upsert',
      currentPolicy ? {
        method: currentPolicy.method,
        safety_stock: currentPolicy.safety_stock,
        reorder_point: currentPolicy.reorder_point,
      } : undefined,
      {
        method: policy.method,
        safety_stock: policy.safety_stock,
        reorder_point: policy.reorder_point,
      }
    )

    return {
      policyId: policy.id,
    }
  } catch (error) {
    console.error('[inventory/upsertPolicy] Error:', error)
    throw new Error(`Failed to upsert policy: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

