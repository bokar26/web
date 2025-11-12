'use server'

import { auth } from '@clerk/nextjs/server'
import {
  CreatePORequest,
  CreatePOResponse,
} from '../types'
import { createPO } from '../data/pos'
import { log } from '../data/audit'

/**
 * Generate PO number: PO-YYYYMMDD-{seq}
 */
function generatePONumber(): string {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
  const seq = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `PO-${dateStr}-${seq}`
}

/**
 * Create purchase order with lines
 */
export async function createPOAction(
  request: CreatePORequest
): Promise<CreatePOResponse> {
  const { supplier_id, lines, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[inventory/createPO] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[inventory/createPO] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  if (!lines || lines.length === 0) {
    throw new Error('PO must have at least one line')
  }

  try {
    const poNumber = generatePONumber()

    const { po, lines: poLines } = await createPO(
      ownerUserId,
      {
        number: poNumber,
        supplier_id,
        status: 'draft',
        expected_date: null,
      },
      lines
    )

    // Audit log
    await log(
      ownerUserId,
      'purchase_orders',
      po.id,
      'po_create',
      undefined,
      {
        number: po.number,
        supplier_id,
        lineCount: poLines.length,
      }
    )

    return {
      poId: po.id,
      number: po.number,
    }
  } catch (error) {
    console.error('[inventory/createPO] Error:', error)
    throw new Error(`Failed to create PO: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

