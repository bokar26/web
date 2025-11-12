'use server'

import { auth } from '@clerk/nextjs/server'
import {
  CreateTransferRequest,
  CreateTransferResponse,
} from '../types'
import { createTransfer } from '../data/transfers'
import { log } from '../data/audit'

/**
 * Create transfer with lines
 */
export async function createTransferAction(
  request: CreateTransferRequest
): Promise<CreateTransferResponse> {
  const { from_warehouse_id, to_warehouse_id, lines, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/createTransfer] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/createTransfer] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  if (from_warehouse_id === to_warehouse_id) {
    throw new Error('From and to warehouses must be different')
  }

  if (!lines || lines.length === 0) {
    throw new Error('Transfer must have at least one line')
  }

  try {
    const { transfer, lines: transferLines } = await createTransfer(
      ownerUserId,
      {
        from_warehouse_id,
        to_warehouse_id,
        status: 'planned',
      },
      lines
    )

    // Audit log
    await log(
      ownerUserId,
      'transfers',
      transfer.id,
      'transfer_create',
      undefined,
      {
        from_warehouse_id,
        to_warehouse_id,
        lineCount: transferLines.length,
      }
    )

    return {
      transferId: transfer.id,
    }
  } catch (error) {
    console.error('[inventory/createTransfer] Error:', error)
    throw new Error(`Failed to create transfer: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

