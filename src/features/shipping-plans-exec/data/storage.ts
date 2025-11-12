/**
 * Storage service for uploading documents to Supabase storage
 */

import { createServerClient } from '@/lib/supabase/server'

export interface UploadResult {
  path: string
  url: string
}

/**
 * Upload document to Supabase storage bucket 'docs'
 * @param shipmentId - Shipment ID for path organization
 * @param filename - Filename to use (should include extension)
 * @param content - File content as string
 * @param contentType - MIME type (e.g., 'text/html', 'application/json')
 */
export async function uploadDocumentToStorage(
  shipmentId: string,
  filename: string,
  content: string,
  contentType: string = 'text/html'
): Promise<UploadResult> {
  const supabase = createServerClient()

  // Path format: shipments/{shipmentId}/{filename}
  const path = `shipments/${shipmentId}/${filename}`

  try {
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('docs')
      .upload(path, content, {
        contentType,
        upsert: false, // Don't overwrite existing files
      })

    if (uploadError) {
      console.error('[docs/storage] Upload error:', uploadError)
      
      // Handle file already exists error
      if (uploadError.message?.includes('already exists') || uploadError.statusCode === '409') {
        throw new Error(`File ${filename} already exists. Please use a different filename.`)
      }
      
      throw new Error(`Failed to upload document: ${uploadError.message}`)
    }

    // Generate signed URL for download (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('docs')
      .createSignedUrl(path, 3600)

    if (urlError || !urlData) {
      console.error('[docs/storage] Signed URL error:', urlError)
      // Still return path even if signed URL fails (can generate later)
      return {
        path: uploadData.path,
        url: path, // Fallback to path
      }
    }

    return {
      path: uploadData.path,
      url: urlData.signedUrl,
    }
  } catch (error) {
    console.error('[docs/storage] Error:', error)
    throw error instanceof Error ? error : new Error('Failed to upload document to storage')
  }
}

/**
 * Generate signed URL for existing document
 */
export async function getDocumentSignedUrl(
  storagePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.storage
      .from('docs')
      .createSignedUrl(storagePath, expiresIn)

    if (error || !data) {
      console.error('[docs/storage] Failed to generate signed URL:', error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error('[docs/storage] Error generating signed URL:', error)
    return null
  }
}

