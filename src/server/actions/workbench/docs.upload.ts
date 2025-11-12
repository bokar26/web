'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface UploadDocumentParams {
  fileName: string
  fileType: string
  fileSize: number
  fileUrl?: string
  metadata?: Record<string, any>
}

export interface UploadDocumentResult {
  documentId: string
}

/**
 * Store document metadata in documents table
 */
export async function uploadDocument(
  params: UploadDocumentParams
): Promise<ActionResult<UploadDocumentResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Insert document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        owner_user_id: userId,
        file_name: params.fileName,
        file_type: params.fileType,
        file_size: params.fileSize,
        file_url: params.fileUrl || null,
        metadata: params.metadata || null,
      })
      .select()
      .single()

    if (docError || !document) {
      return { ok: false, error: docError?.message || 'Failed to upload document' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'document',
      entityId: document.id,
      action: 'upload',
      afterState: { fileName: params.fileName, fileType: params.fileType },
    })

    return {
      ok: true,
      data: {
        documentId: document.id,
      },
    }
  } catch (error: any) {
    console.error('[docs.upload] Error:', error)
    return { ok: false, error: error.message || 'Failed to upload document' }
  }
}

