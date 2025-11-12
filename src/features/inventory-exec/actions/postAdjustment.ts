'use server'

import { auth } from '@clerk/nextjs/server'
import {
  PostAdjustmentRequest,
  PostAdjustmentResponse,
} from '../types'
import { createAdjustment } from '../data/adjustments'
import { createTransaction } from '../data/transactions'
import { upsertSnapshot, getLatestSnapshot } from '../data/snapshots'
import { log } from '../data/audit'

/**
 * Post stock adjustment and create transaction
 */
export async function postAdjustment(
  request: PostAdjustmentRequest
): Promise<PostAdjustmentResponse> {
  const { sku_id, warehouse_id, qty_delta, reason, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/postAdjustment] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/postAdjustment] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get current snapshot
    const snapshot = await getLatestSnapshot(ownerUserId, sku_id, warehouse_id)
    const currentOnHand = snapshot?.on_hand || 0

    // Create adjustment
    const adjustment = await createAdjustment(ownerUserId, {
      sku_id,
      warehouse_id,
      qty_delta,
      reason,
    })

    // Create transaction
    const transaction = await createTransaction(ownerUserId, {
      ts: new Date().toISOString(),
      type: 'adjust',
      sku_id,
      warehouse_id,
      qty: qty_delta,
      unit_cost: null,
      doc_ref: adjustment.id,
      meta_json: { reason, adjustment_id: adjustment.id },
    })

    // Update snapshot
    const newOnHand = currentOnHand + qty_delta
    const today = new Date().toISOString().split('T')[0]
    await upsertSnapshot(ownerUserId, {
      date: today,
      sku_id,
      warehouse_id,
      on_hand: newOnHand,
      reserved: snapshot?.reserved || 0,
      on_order: snapshot?.on_order || 0,
      backorder: snapshot?.backorder || 0,
    })

    // Audit log
    await log(
      ownerUserId,
      'stock_adjustments',
      adjustment.id,
      'inventory_adjust',
      { on_hand: currentOnHand },
      { on_hand: newOnHand, qty_delta, reason }
    )

    return {
      adjustmentId: adjustment.id,
      transactionId: transaction.id,
    }
  } catch (error) {
    console.error('[inventory/postAdjustment] Error:', error)
    throw new Error(`Failed to post adjustment: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

