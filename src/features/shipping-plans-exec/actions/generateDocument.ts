'use server'

import { auth } from '@clerk/nextjs/server'
import {
  GenerateDocumentRequest,
  GenerateDocumentResponse,
} from '../types'
import { getShipment } from '../data/shipments'
import { createDocument, getLatestDocument } from '../data/documents'
import { log } from '../data/audit'
import { generateDocumentContent } from '../data/documentContent'
import { uploadDocumentToStorage } from '../data/storage'
import { makeSafeFilename } from '../utils/filename'

/**
 * Generate document (ASN, CI, PL) - creates HTML placeholder and uploads to storage
 */
export async function generateDocument(
  request: GenerateDocumentRequest
): Promise<GenerateDocumentResponse> {
  const { shipmentId, documentType, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    console.error('[docs/generate] User not authenticated')
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    console.error('[docs/generate] User ID mismatch', { ownerUserId, userId })
    throw new Error('User ID mismatch')
  }

  try {
    // Get shipment with full data (legs, containers, items, allocations)
    const shipment = await getShipment(ownerUserId, shipmentId)
    if (!shipment) {
      console.error('[docs/generate] Shipment not found:', shipmentId)
      throw new Error('Shipment not found')
    }

    // Get latest version to determine next version number
    const latestDoc = await getLatestDocument(shipmentId, documentType)
    const nextVersion = latestDoc ? latestDoc.version + 1 : 1

    // Generate document content (HTML)
    const htmlContent = generateDocumentContent(shipment, documentType)

    // Generate filename: {shipmentId}_{type}_v{version}.html
    const filename = makeSafeFilename(
      `${shipmentId.slice(0, 8)}_${documentType}`,
      `v${nextVersion}.html`
    )

    // Upload to storage
    const { path: storagePath, url: signedUrl } = await uploadDocumentToStorage(
      shipmentId,
      filename,
      htmlContent,
      'text/html'
    )

    // Create document record
    const document = await createDocument(shipmentId, documentType, {
      storage_path: storagePath,
      created_by: ownerUserId,
    })

    // Log audit
    await log(ownerUserId, 'document', document.id, 'generate_document', undefined, {
      shipment_id: shipmentId,
      document_type: documentType,
      version: document.version,
      storage_path: storagePath,
    })

    return {
      documentId: document.id,
      url: signedUrl,
      version: document.version,
    }
  } catch (error) {
    console.error('[docs/generate] Error:', error)
    
    // Return toast-safe error message
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('already exists')) {
        throw new Error('Document file already exists. Please try again.')
      }
      if (error.message.includes('not found')) {
        throw new Error('Shipment not found. Please verify the shipment exists.')
      }
      throw new Error(`Failed to generate document: ${error.message}`)
    }
    
    throw new Error('Failed to generate document')
  }
}

