'use server'

import { auth } from '@clerk/nextjs/server'
import {
  FinalizeCycleCountRequest,
  FinalizeCycleCountResponse,
} from '../types'
import { getCycleCount, updateCountLine, updateCycleCountStatus } from '../data/counts'
import { createTransaction } from '../data/transactions'
import { log } from '../data/audit'

/**
 * Finalize cycle count and create adjustment transactions for variances
 */
export async function finalizeCycleCount(
  request: FinalizeCycleCountRequest
): Promise<FinalizeCycleCountResponse> {
  const { cycle_count_id, lines, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/finalizeCycleCount] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/finalizeCycleCount] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get cycle count
    const count = await getCycleCount(ownerUserId, cycle_count_id)
    if (!count) {
      throw new Error('Cycle count not found')
    }

    if (count.status === 'posted') {
      throw new Error('Cycle count already finalized')
    }

    const transactionIds: string[] = []

    // Update each count line and create transactions for variances
    for (const line of lines) {
      const countLine = count.lines?.find(l => l.sku_id === line.sku_id)
      if (!countLine) {
        console.warn(`[inventory/finalizeCycleCount] Count line not found for SKU ${line.sku_id}`)
        continue
      }

      // Update count line
      await updateCountLine(
        ownerUserId,
        countLine.id,
        line.counted_qty,
        countLine.system_qty
      )

      // Calculate variance
      const variance = line.counted_qty - countLine.system_qty

      // Create transaction if variance != 0
      if (variance !== 0) {
        const transaction = await createTransaction(ownerUserId, {
          ts: new Date().toISOString(),
          type: 'adjust',
          sku_id: line.sku_id,
          warehouse_id: count.warehouse_id,
          qty: variance,
          unit_cost: null,
          doc_ref: cycle_count_id,
          meta_json: {
            cycle_count_id,
            system_qty: countLine.system_qty,
            counted_qty: line.counted_qty,
            variance,
          },
        })

        transactionIds.push(transaction.id)
      }
    }

    // Update cycle count status to posted
    await updateCycleCountStatus(ownerUserId, cycle_count_id, 'posted')

    // Audit log
    await log(
      ownerUserId,
      'cycle_counts',
      cycle_count_id,
      'finalize_cycle_count',
      { status: count.status },
      {
        status: 'posted',
        transactionCount: transactionIds.length,
      }
    )

    return {
      transactionIds,
    }
  } catch (error) {
    console.error('[inventory/finalizeCycleCount] Error:', error)
    throw new Error(`Failed to finalize cycle count: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

