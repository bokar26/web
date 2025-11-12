'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface RaisePOParams {
  supplierId: string
  lines: Array<{
    skuId: string
    quantity: number
    unitPrice: number
  }>
  documentIds?: string[]
}

export interface RaisePOResult {
  poId: string
  lineCount: number
}

/**
 * Create purchase_orders + po_lines from simulation/forecast
 */
export async function raisePO(params: RaisePOParams): Promise<ActionResult<RaisePOResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Get partner (supplier) info
    const { data: partner } = await supabase
      .from('partners')
      .select('id')
      .eq('id', params.supplierId)
      .maybeSingle()

    if (!partner) {
      return { ok: false, error: 'Supplier not found' }
    }

    // Create purchase order
    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .insert({
        owner_user_id: userId,
        supplier_id: params.supplierId,
        status: 'draft',
        total_amount: params.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
      })
      .select()
      .single()

    if (poError || !po) {
      return { ok: false, error: poError?.message || 'Failed to create purchase order' }
    }

    // Create PO lines
    const poLines = params.lines.map((line) => ({
      po_id: po.id,
      sku_id: line.skuId,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      line_total: line.quantity * line.unitPrice,
    }))

    const { error: linesError } = await supabase.from('po_lines').insert(poLines)

    if (linesError) {
      return { ok: false, error: linesError.message || 'Failed to create PO lines' }
    }

    // Link documents if provided
    if (params.documentIds && params.documentIds.length > 0) {
      // Documents are linked via documents table's entity_type and entity_id
      // This would be handled by docs.link action separately
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'purchase_order',
      entityId: po.id,
      action: 'create',
      afterState: { supplierId: params.supplierId, lineCount: params.lines.length },
    })

    return {
      ok: true,
      data: {
        poId: po.id,
        lineCount: poLines.length,
      },
    }
  } catch (error: any) {
    console.error('[po.raise] Error:', error)
    return { ok: false, error: error.message || 'Failed to raise PO' }
  }
}

