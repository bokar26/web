/**
 * Documents data service
 * CRUD operations for documents
 */

import { createServerClient } from '@/lib/supabase/server'
import {
  SupabaseDocument,
  Document,
  DocumentType,
} from '../types'

/**
 * Create a document
 */
export async function createDocument(
  shipmentId: string,
  documentType: DocumentType,
  data: Omit<SupabaseDocument, 'id' | 'shipment_id' | 'document_type' | 'version' | 'generated_at' | 'created_at' | 'updated_at'>
): Promise<SupabaseDocument> {
  const supabase = createServerClient()

  // Get latest version for this document type
  const { data: latestDoc } = await supabase
    .from('documents')
    .select('version')
    .eq('shipment_id', shipmentId)
    .eq('document_type', documentType)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersion = latestDoc ? latestDoc.version + 1 : 1

  const { data: document, error } = await supabase
    .from('documents')
    .insert({
      ...data,
      shipment_id: shipmentId,
      document_type: documentType,
      version: nextVersion,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create document:', error)
    throw new Error(`Failed to create document: ${error.message}`)
  }

  return document as SupabaseDocument
}

/**
 * Get document by ID
 */
export async function getDocument(documentId: string): Promise<SupabaseDocument | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SupabaseDocument
}

/**
 * List documents for shipment
 */
export async function listDocumentsForShipment(
  shipmentId: string,
  documentType?: DocumentType
): Promise<SupabaseDocument[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('documents')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('document_type', { ascending: true })
    .order('version', { ascending: false })

  if (documentType) {
    query = query.eq('document_type', documentType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to list documents:', error)
    throw new Error(`Failed to list documents: ${error.message}`)
  }

  return (data || []) as SupabaseDocument[]
}

/**
 * Get latest document version for shipment and type
 */
export async function getLatestDocument(
  shipmentId: string,
  documentType: DocumentType
): Promise<SupabaseDocument | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('shipment_id', shipmentId)
    .eq('document_type', documentType)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data as SupabaseDocument
}

