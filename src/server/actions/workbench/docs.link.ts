'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface LinkDocumentParams {
  documentId: string
  entityType: 'purchase_order' | 'shipment' | 'published_forecast'
  entityId: string
}

export interface LinkDocumentResult {
  documentId: string
  linked: boolean
}

/**
 * Link document to purchase_order, shipment, or published_forecast
 */
export async function linkDocument(
  params: LinkDocumentParams
): Promise<ActionResult<LinkDocumentResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Update document with entity linkage
    const { data: document, error: updateError } = await supabase
      .from('documents')
      .update({
        entity_type: params.entityType,
        entity_id: params.entityId,
      })
      .eq('id', params.documentId)
      .eq('owner_user_id', userId)
      .select()
      .single()

    if (updateError || !document) {
      return { ok: false, error: updateError?.message || 'Failed to link document' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'document',
      entityId: params.documentId,
      action: 'link',
      afterState: { entityType: params.entityType, entityId: params.entityId },
    })

    return {
      ok: true,
      data: {
        documentId: params.documentId,
        linked: true,
      },
    }
  } catch (error: any) {
    console.error('[docs.link] Error:', error)
    return { ok: false, error: error.message || 'Failed to link document' }
  }
}

