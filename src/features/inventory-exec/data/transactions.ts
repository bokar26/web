/**
 * Inventory transactions data service
 * CRUD operations for inventory_transactions
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseInventoryTransaction, InventoryTransaction, TransactionType } from '../types'

/**
 * Create inventory transaction
 */
export async function createTransaction(
  ownerUserId: string,
  data: Omit<SupabaseInventoryTransaction, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseInventoryTransaction> {
  const supabase = createServerClient()

  const { data: transaction, error } = await supabase
    .from('inventory_transactions')
    .insert({
      ...data,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/transactions] Failed to create transaction:', error)
    throw new Error(`Failed to create transaction: ${error.message}`)
  }

  return transaction as SupabaseInventoryTransaction
}

/**
 * List transactions for SKU/warehouse
 */
export async function listTransactions(
  ownerUserId: string,
  options?: {
    skuId?: string
    warehouseId?: string
    type?: TransactionType
    startDate?: string
    endDate?: string
    limit?: number
  }
): Promise<InventoryTransaction[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('inventory_transactions')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('ts', { ascending: false })

  if (options?.skuId) {
    query = query.eq('sku_id', options.skuId)
  }

  if (options?.warehouseId) {
    query = query.eq('warehouse_id', options.warehouseId)
  }

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  if (options?.startDate) {
    query = query.gte('ts', options.startDate)
  }

  if (options?.endDate) {
    query = query.lte('ts', options.endDate)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/transactions] Failed to list transactions:', error)
    return []
  }

  return (data || []) as InventoryTransaction[]
}

/**
 * Calculate average daily demand from transactions (last N days)
 */
export async function calculateAvgDailyDemand(
  ownerUserId: string,
  skuId: string,
  warehouseId: string,
  days: number = 30
): Promise<number> {
  const supabase = createServerClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('inventory_transactions')
    .select('qty, type, ts')
    .eq('owner_user_id', ownerUserId)
    .eq('sku_id', skuId)
    .eq('warehouse_id', warehouseId)
    .in('type', ['receipt', 'issue'])
    .gte('ts', startDate.toISOString())

  if (error || !data || data.length === 0) {
    return 0
  }

  // Sum issue transactions (demand) over the period
  const totalDemand = data
    .filter(t => t.type === 'issue')
    .reduce((sum, t) => sum + Math.abs(t.qty), 0)

  return totalDemand / days
}

