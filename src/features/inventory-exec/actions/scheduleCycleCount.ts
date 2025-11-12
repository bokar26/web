'use server'

import { auth } from '@clerk/nextjs/server'
import {
  ScheduleCycleCountRequest,
  ScheduleCycleCountResponse,
} from '../types'
import { createCycleCount } from '../data/counts'
import { listSnapshots } from '../data/snapshots'
import { log } from '../data/audit'

/**
 * Schedule cycle count
 */
export async function scheduleCycleCount(
  request: ScheduleCycleCountRequest
): Promise<ScheduleCycleCountResponse> {
  const { scheduled_date, warehouse_id, skuIds, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/scheduleCycleCount] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/scheduleCycleCount] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    let lines: Array<{ sku_id: string; system_qty: number }> = []

    if (skuIds && skuIds.length > 0) {
      // Use provided SKU IDs
      const today = new Date().toISOString().split('T')[0]
      const snapshots = await listSnapshots(ownerUserId, {
        warehouseId: warehouse_id,
        startDate: today,
        endDate: today,
      })

      lines = skuIds.map(skuId => {
        const snapshot = snapshots.find(s => s.sku_id === skuId)
        return {
          sku_id: skuId,
          system_qty: snapshot?.on_hand || 0,
        }
      })
    } else {
      // Get all SKUs in warehouse from latest snapshots
      const today = new Date().toISOString().split('T')[0]
      const snapshots = await listSnapshots(ownerUserId, {
        warehouseId: warehouse_id,
        startDate: today,
        endDate: today,
      })

      lines = snapshots.map(s => ({
        sku_id: s.sku_id,
        system_qty: s.on_hand,
      }))
    }

    if (lines.length === 0) {
      throw new Error('No SKUs found for cycle count')
    }

    const { count } = await createCycleCount(
      ownerUserId,
      {
        scheduled_date,
        warehouse_id,
        status: 'scheduled',
      },
      lines
    )

    // Audit log
    await log(
      ownerUserId,
      'cycle_counts',
      count.id,
      'schedule_cycle_count',
      undefined,
      {
        scheduled_date,
        warehouse_id,
        skuCount: lines.length,
      }
    )

    return {
      countId: count.id,
    }
  } catch (error) {
    console.error('[inventory/scheduleCycleCount] Error:', error)
    throw new Error(`Failed to schedule cycle count: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

