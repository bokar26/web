/**
 * Audit logging service for Inventory Execution
 * Reuses the audit_logs table from shipping (shared across features)
 */

import { createServerClient } from '@/lib/supabase/server'
import { SupabaseAuditLog } from '../types'

export type AuditEvent = {
  entityType: string
  entityId: string
  action: string
  beforeState?: Record<string, any>
  afterState?: Record<string, any>
}

/**
 * Log an audit event
 * @param ownerUserId - Clerk user ID
 * @param event - Audit event details
 */
export async function logAuditEvent(
  ownerUserId: string,
  event: AuditEvent
): Promise<SupabaseAuditLog> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      owner_user_id: ownerUserId,
      entity_type: event.entityType,
      entity_id: event.entityId,
      action: event.action,
      before_state: event.beforeState || null,
      after_state: event.afterState || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[inventory/audit] Failed to write audit log:', error)
    throw new Error(`Failed to write audit log: ${error.message}`)
  }

  return data as SupabaseAuditLog
}

/**
 * Convenience function for logging with before/after states
 */
export async function log(
  ownerUserId: string,
  entityType: string,
  entityId: string,
  action: string,
  beforeState?: Record<string, any>,
  afterState?: Record<string, any>
): Promise<SupabaseAuditLog> {
  return logAuditEvent(ownerUserId, {
    entityType,
    entityId,
    action,
    beforeState,
    afterState,
  })
}

/**
 * List audit logs for owner, optionally filtered by entity
 */
export async function listAuditLogs(
  ownerUserId: string,
  options?: {
    entityType?: string
    entityId?: string
    limit?: number
  }
): Promise<SupabaseAuditLog[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('audit_logs')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('created_at', { ascending: false })

  if (options?.entityType) {
    query = query.eq('entity_type', options.entityType)
  }

  if (options?.entityId) {
    query = query.eq('entity_id', options.entityId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[inventory/audit] Failed to list audit logs:', error)
    throw new Error(`Failed to list audit logs: ${error.message}`)
  }

  return (data || []) as SupabaseAuditLog[]
}

