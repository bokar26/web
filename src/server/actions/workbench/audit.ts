'use server'

import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export interface AuditEvent {
  entityType: string
  entityId: string
  action: string
  beforeState?: Record<string, any>
  afterState?: Record<string, any>
}

/**
 * Log an audit event to audit_logs table
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  const { userId } = await auth()
  if (!userId) {
    console.warn('[audit] No user ID, skipping audit log')
    return
  }

  const supabase = createServerClient()
  if (!supabase) {
    console.warn('[audit] Supabase client not available, skipping audit log')
    return
  }

  const { error } = await supabase.from('audit_logs').insert({
    owner_user_id: userId,
    entity_type: event.entityType,
    entity_id: event.entityId,
    action: event.action,
    before_state: event.beforeState || null,
    after_state: event.afterState || null,
  })

  if (error) {
    console.error('[audit] Failed to write audit log:', error)
    // Don't throw - audit logging should not break the main operation
  }
}

