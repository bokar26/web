'use server'

import { auth } from '@clerk/nextjs/server'
import {
  GetInventoryExecutionDataRequest,
  GetInventoryExecutionDataResponse,
} from '../types'
import { listPlans } from '../data/plans'
import { listPOs } from '../data/pos'
import { listTransfers } from '../data/transfers'
import { listAdjustments } from '../data/adjustments'
import { listCycleCounts } from '../data/counts'
import { listAuditLogs } from '../data/audit'

/**
 * Get all execution data for InventoryConsole/SKUDrawer
 */
export async function getInventoryExecutionData(
  request?: GetInventoryExecutionDataRequest
): Promise<GetInventoryExecutionDataResponse> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const { skuId, warehouseId } = request || {}

  try {
    // Fetch all data in parallel
    const [plans, pos, transfers, adjustments, counts, auditLogs] = await Promise.all([
      listPlans(userId, {
        skuId,
        warehouseId,
        status: 'new',
        limit: 50,
      }).catch(() => []),
      listPOs(userId, {
        limit: 50,
      }).catch(() => []),
      listTransfers(userId, {
        limit: 50,
      }).catch(() => []),
      listAdjustments(userId, {
        skuId,
        warehouseId,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        limit: 50,
      }).catch(() => []),
      listCycleCounts(userId, {
        limit: 50,
      }).catch(() => []),
      listAuditLogs(userId, {
        limit: 50,
      }).catch(() => []),
    ])

    return {
      plans,
      pos,
      transfers,
      adjustments,
      counts,
      auditLogs,
    }
  } catch (error) {
    console.error('[inventory/getInventoryExecutionData] Error:', error)
    // Return empty data on error to prevent UI crashes
    return {
      plans: [],
      pos: [],
      transfers: [],
      adjustments: [],
      counts: [],
      auditLogs: [],
    }
  }
}

