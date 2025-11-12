/**
 * Transfers data service
 * CRUD operations for transfers and transfer_lines
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseTransfer, SupabaseTransferLine, Transfer, TransferLine, TransferStatus } from '../types'

/**
 * Create transfer with lines
 */
export async function createTransfer(
  ownerUserId: string,
  transferData: Omit<SupabaseTransfer, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>,
  lines: Array<Omit<SupabaseTransferLine, 'id' | 'owner_user_id' | 'transfer_id' | 'created_at' | 'updated_at'>>
): Promise<{ transfer: SupabaseTransfer; lines: SupabaseTransferLine[] }> {
  const supabase = createServerClient()

  // Create transfer
  const { data: transfer, error: transferError } = await supabase
    .from('transfers')
    .insert({
      ...transferData,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (transferError) {
    console.error('[inventory/transfers] Failed to create transfer:', transferError)
    throw new Error(`Failed to create transfer: ${transferError.message}`)
  }

  // Create lines
  const { data: transferLines, error: linesError } = await supabase
    .from('transfer_lines')
    .insert(
      lines.map(line => ({
        ...line,
        transfer_id: transfer.id,
        owner_user_id: ownerUserId,
      }))
    )
    .select()

  if (linesError) {
    console.error('[inventory/transfers] Failed to create transfer lines:', linesError)
    throw new Error(`Failed to create transfer lines: ${linesError.message}`)
  }

  return {
    transfer: transfer as SupabaseTransfer,
    lines: (transferLines || []) as SupabaseTransferLine[],
  }
}

/**
 * Get transfer by ID with lines
 */
export async function getTransfer(
  ownerUserId: string,
  transferId: string
): Promise<Transfer | null> {
  const supabase = createServerClient()

  const { data: transfer, error: transferError } = await supabase
    .from('transfers')
    .select('*')
    .eq('id', transferId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (transferError || !transfer) {
    return null
  }

  const { data: lines, error: linesError } = await supabase
    .from('transfer_lines')
    .select('*')
    .eq('transfer_id', transferId)
    .eq('owner_user_id', ownerUserId)

  if (linesError) {
    console.error('[inventory/transfers] Failed to get transfer lines:', linesError)
  }

  return {
    ...transfer,
    lines: (lines || []) as TransferLine[],
  } as Transfer
}

/**
 * List transfers for owner
 */
export async function listTransfers(
  ownerUserId: string,
  options?: {
    status?: TransferStatus
    fromWarehouseId?: string
    toWarehouseId?: string
    limit?: number
  }
): Promise<Transfer[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('transfers')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.fromWarehouseId) {
    query = query.eq('from_warehouse_id', options.fromWarehouseId)
  }

  if (options?.toWarehouseId) {
    query = query.eq('to_warehouse_id', options.toWarehouseId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/transfers] Failed to list transfers:', error)
    return []
  }

  // Fetch lines for each transfer
  const transfersWithLines = await Promise.all(
    (data || []).map(async (transfer) => {
      const { data: lines } = await supabase
        .from('transfer_lines')
        .select('*')
        .eq('transfer_id', transfer.id)
        .eq('owner_user_id', ownerUserId)

      return {
        ...transfer,
        lines: (lines || []) as TransferLine[],
      } as Transfer
    })
  )

  return transfersWithLines
}

/**
 * Update transfer status
 */
export async function updateTransferStatus(
  ownerUserId: string,
  transferId: string,
  status: TransferStatus
): Promise<SupabaseTransfer> {
  const supabase = createServerClient()

  const { data: transfer, error } = await supabase
    .from('transfers')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transferId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[inventory/transfers] Failed to update transfer status:', error)
    throw new Error(`Failed to update transfer status: ${error.message}`)
  }

  return transfer as SupabaseTransfer
}

