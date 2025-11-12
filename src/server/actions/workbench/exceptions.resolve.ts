'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface ResolveExceptionParams {
  exceptionId: string
  exceptionType: 'forecast' | 'general'
  resolutionNote?: string
}

export interface ResolveExceptionResult {
  exceptionId: string
}

/**
 * Resolve an exception by setting resolved_at, resolved_by, and resolution_note
 */
export async function resolveException(
  params: ResolveExceptionParams
): Promise<ActionResult<ResolveExceptionResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    const tableName = params.exceptionType === 'forecast' ? 'forecast_exceptions' : 'exceptions'

    // Get current state
    const { data: existing } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', params.exceptionId)
      .single()

    if (!existing) {
      return { ok: false, error: 'Exception not found' }
    }

    // Update exception
    const { data: updated, error: updateError } = await supabase
      .from(tableName)
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: userId,
        resolution_note: params.resolutionNote || null,
      })
      .eq('id', params.exceptionId)
      .select()
      .single()

    if (updateError || !updated) {
      return { ok: false, error: updateError?.message || 'Failed to resolve exception' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: tableName,
      entityId: params.exceptionId,
      action: 'resolve',
      beforeState: { status: existing.status },
      afterState: { status: 'resolved', resolvedBy: userId },
    })

    return {
      ok: true,
      data: {
        exceptionId: params.exceptionId,
      },
    }
  } catch (error: any) {
    console.error('[exceptions.resolve] Error:', error)
    return { ok: false, error: error.message || 'Failed to resolve exception' }
  }
}

