/**
 * Cycle counts data service
 * CRUD operations for cycle_counts and count_lines
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseCycleCount, SupabaseCountLine, CycleCount, CountLine, CycleCountStatus } from '../types'

/**
 * Create cycle count with lines
 */
export async function createCycleCount(
  ownerUserId: string,
  countData: Omit<SupabaseCycleCount, 'id' | 'owner_user_id' | 'created_at' | 'updated_at'>,
  lines: Array<Omit<SupabaseCountLine, 'id' | 'owner_user_id' | 'cycle_count_id' | 'counted_qty' | 'variance' | 'created_at' | 'updated_at'>>
): Promise<{ count: SupabaseCycleCount; lines: SupabaseCountLine[] }> {
  const supabase = createServerClient()

  // Create cycle count
  const { data: count, error: countError } = await supabase
    .from('cycle_counts')
    .insert({
      ...countData,
      owner_user_id: ownerUserId,
    })
    .select()
    .single()

  if (countError) {
    console.error('[inventory/counts] Failed to create cycle count:', countError)
    throw new Error(`Failed to create cycle count: ${countError.message}`)
  }

  // Create lines
  const { data: countLines, error: linesError } = await supabase
    .from('count_lines')
    .insert(
      lines.map(line => ({
        ...line,
        cycle_count_id: count.id,
        owner_user_id: ownerUserId,
      }))
    )
    .select()

  if (linesError) {
    console.error('[inventory/counts] Failed to create count lines:', linesError)
    throw new Error(`Failed to create count lines: ${linesError.message}`)
  }

  return {
    count: count as SupabaseCycleCount,
    lines: (countLines || []) as SupabaseCountLine[],
  }
}

/**
 * Get cycle count by ID with lines
 */
export async function getCycleCount(
  ownerUserId: string,
  countId: string
): Promise<CycleCount | null> {
  const supabase = createServerClient()

  const { data: count, error: countError } = await supabase
    .from('cycle_counts')
    .select('*')
    .eq('id', countId)
    .eq('owner_user_id', ownerUserId)
    .single()

  if (countError || !count) {
    return null
  }

  const { data: lines, error: linesError } = await supabase
    .from('count_lines')
    .select('*')
    .eq('cycle_count_id', countId)
    .eq('owner_user_id', ownerUserId)

  if (linesError) {
    console.error('[inventory/counts] Failed to get count lines:', linesError)
  }

  return {
    ...count,
    lines: (lines || []) as CountLine[],
  } as CycleCount
}

/**
 * List cycle counts for owner
 */
export async function listCycleCounts(
  ownerUserId: string,
  options?: {
    status?: CycleCountStatus
    warehouseId?: string
    startDate?: string
    endDate?: string
    limit?: number
  }
): Promise<CycleCount[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('cycle_counts')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('scheduled_date', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.warehouseId) {
    query = query.eq('warehouse_id', options.warehouseId)
  }

  if (options?.startDate) {
    query = query.gte('scheduled_date', options.startDate)
  }

  if (options?.endDate) {
    query = query.lte('scheduled_date', options.endDate)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/counts] Failed to list cycle counts:', error)
    return []
  }

  // Fetch lines for each count
  const countsWithLines = await Promise.all(
    (data || []).map(async (count) => {
      const { data: lines } = await supabase
        .from('count_lines')
        .select('*')
        .eq('cycle_count_id', count.id)
        .eq('owner_user_id', ownerUserId)

      return {
        ...count,
        lines: (lines || []) as CountLine[],
      } as CycleCount
    })
  )

  return countsWithLines
}

/**
 * Update count line with counted quantity and variance
 */
export async function updateCountLine(
  ownerUserId: string,
  lineId: string,
  countedQty: number,
  systemQty: number
): Promise<SupabaseCountLine> {
  const supabase = createServerClient()

  const variance = countedQty - systemQty

  const { data: line, error } = await supabase
    .from('count_lines')
    .update({
      counted_qty: countedQty,
      variance,
      updated_at: new Date().toISOString(),
    })
    .eq('id', lineId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[inventory/counts] Failed to update count line:', error)
    throw new Error(`Failed to update count line: ${error.message}`)
  }

  return line as SupabaseCountLine
}

/**
 * Update cycle count status
 */
export async function updateCycleCountStatus(
  ownerUserId: string,
  countId: string,
  status: CycleCountStatus
): Promise<SupabaseCycleCount> {
  const supabase = createServerClient()

  const { data: count, error } = await supabase
    .from('cycle_counts')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', countId)
    .eq('owner_user_id', ownerUserId)
    .select()
    .single()

  if (error) {
    console.error('[inventory/counts] Failed to update cycle count status:', error)
    throw new Error(`Failed to update cycle count status: ${error.message}`)
  }

  return count as SupabaseCycleCount
}

