'use server'

import { auth } from '@clerk/nextjs/server'
import { getShipment } from '../data/shipments'
import { listDocumentsForShipment } from '../data/documents'
import { getDocumentSignedUrl } from '../data/storage'
import type { SupabaseDocument } from '../types'

export interface ListDocumentsRequest {
  shipmentId: string
  ownerUserId: string
}

export interface DocumentWithUrl extends SupabaseDocument {
  downloadUrl?: string | null
}

export interface ListDocumentsResponse {
  documents: DocumentWithUrl[]
}

/**
 * List documents for a shipment with signed URLs
 */
export async function listDocuments(
  request: ListDocumentsRequest
): Promise<ListDocumentsResponse> {
  const { shipmentId, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[docs/list] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[docs/list] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Verify shipment belongs to owner
    const shipment = await getShipment(ownerUserId, shipmentId)
    if (!shipment) {
      console.error('[docs/list] Shipment not found:', shipmentId)
      throw new Error('Shipment not found')
    }

    // Get documents
    const documents = await listDocumentsForShipment(shipmentId)

    // Generate signed URLs for each document
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        let downloadUrl: string | null = null
        if (doc.storage_path) {
          downloadUrl = await getDocumentSignedUrl(doc.storage_path, 3600)
        }
        return {
          ...doc,
          downloadUrl,
        }
      })
    )

    return {
      documents: documentsWithUrls,
    }
  } catch (error) {
    console.error('[docs/list] Error:', error)
    throw error instanceof Error ? error : new Error('Failed to list documents')
  }
}

