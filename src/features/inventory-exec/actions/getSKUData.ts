'use server'

import { auth } from '@clerk/nextjs/server'
import { getLatestSnapshot } from '../data/snapshots'
import { listTransactions } from '../data/transactions'
import { listForecasts } from '../data/forecasts'
import { getPolicy } from '../data/policies'
import type { InventorySnapshot, InventoryTransaction, Forecast, ReorderPolicy } from '../types'

export interface GetSKUDataResponse {
  snapshot: InventorySnapshot | null
  transactions: InventoryTransaction[]
  forecasts: Forecast[]
  policy: ReorderPolicy | null
}

/**
 * Get SKU data for SKUDrawer
 */
export async function getSKUData(
  skuId: string,
  warehouseId: string
): Promise<GetSKUDataResponse> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  try {
    const [snapshot, transactions, forecasts, policy] = await Promise.all([
      getLatestSnapshot(userId, skuId, warehouseId).catch(() => null),
      listTransactions(userId, { skuId, warehouseId, limit: 90 }).catch(() => []),
      listForecasts(userId, { skuId, warehouseId, limit: 30 }).catch(() => []),
      getPolicy(userId, skuId, warehouseId).catch(() => null),
    ])

    return {
      snapshot,
      transactions,
      forecasts,
      policy,
    }
  } catch (error) {
    console.error('[inventory/getSKUData] Error:', error)
    // Return empty data on error to prevent UI crashes
    return {
      snapshot: null,
      transactions: [],
      forecasts: [],
      policy: null,
    }
  }
}

