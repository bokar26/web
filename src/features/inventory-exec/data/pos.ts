/**
 * Purchase orders data service
 * CRUD operations for purchase_orders and po_lines
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabasePurchaseOrder, SupabasePOLine, PurchaseOrder, POLine, POStatus } from '../types'

/**
 * Create purchase order with lines
 */
export async function createPO(
  ownerUserId: string,
  poData: Omit<SupabasePurchaseOrder, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>,
  lines: Array<Omit<SupabasePOLine, 'id' | 'owner_user_id' | 'po_id' | 'created_at' | 'updated_at'>>
): Promise<{ po: SupabasePurchaseOrder; lines: SupabasePOLine[] }> {
  const supabase = createServerClient()

  // Create PO
  const { data: po, error: poError } = await supabase
    .from('purchase_orders')
    .insert({
      ...poData,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (poError) {
    console.error('[inventory/pos] Failed to create PO:', poError)
    throw new Error(`Failed to create PO: ${poError.message}`)
  }

  // Create lines
  const { data: poLines, error: linesError } = await supabase
    .from('po_lines')
    .insert(
      lines.map(line => ({
        ...line,
        po_id: po.id,
        owner_user_id: ownerUserId,
      }))
    )
    .select()

  if (linesError) {
    console.error('[inventory/pos] Failed to create PO lines:', linesError)
    throw new Error(`Failed to create PO lines: ${linesError.message}`)
  }

  return {
    po: po as SupabasePurchaseOrder,
    lines: (poLines || []) as SupabasePOLine[],
  }
}

/**
 * Get PO by ID with lines
 */
export async function getPO(
  ownerUserId: string,
  poId: string
): Promise<PurchaseOrder | null> {
  const supabase = createServerClient()

  const { data: po, error: poError } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('id', poId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (poError || !po) {
    return null
  }

  const { data: lines, error: linesError } = await supabase
    .from('po_lines')
    .select('*')
    .eq('po_id', poId)
    .eq('owner_user_id', ownerUserId)

  if (linesError) {
    console.error('[inventory/pos] Failed to get PO lines:', linesError)
  }

  return {
    ...po,
    lines: (lines || []) as POLine[],
  } as PurchaseOrder
}

/**
 * List POs for owner
 */
export async function listPOs(
  ownerUserId: string,
  options?: {
    status?: POStatus
    supplierId?: string
    limit?: number
  }
): Promise<PurchaseOrder[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('purchase_orders')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.supplierId) {
    query = query.eq('supplier_id', options.supplierId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/pos] Failed to list POs:', error)
    return []
  }

  // Fetch lines for each PO
  const posWithLines = await Promise.all(
    (data || []).map(async (po) => {
      const { data: lines } = await supabase
        .from('po_lines')
        .select('*')
        .eq('po_id', po.id)
        .eq('owner_user_id', ownerUserId)

      return {
        ...po,
        lines: (lines || []) as POLine[],
      } as PurchaseOrder
    })
  )

  return posWithLines
}

/**
 * Update PO status
 */
export async function updatePOStatus(
  ownerUserId: string,
  poId: string,
  status: POStatus
): Promise<SupabasePurchaseOrder> {
  const supabase = createServerClient()

  const { data: po, error } = await supabase
    .from('purchase_orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', poId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[inventory/pos] Failed to update PO status:', error)
    throw new Error(`Failed to update PO status: ${error.message}`)
  }

  return po as SupabasePurchaseOrder
}

