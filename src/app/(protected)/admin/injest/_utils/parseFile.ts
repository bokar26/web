import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { BulkVendorRow } from '@/types/vendors'

/**
 * Normalize vendor name for deduplication
 */
export function normalizeVendorName(name: string): string {
  return (name || '').toLowerCase().trim()
}

/**
 * Validate a vendor row
 */
export function validateVendorRow(row: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!row.name || typeof row.name !== 'string' || row.name.trim().length === 0) {
    errors.push('Name is required')
  }

  if (row.email && typeof row.email === 'string' && row.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(row.email.trim())) {
      errors.push('Invalid email format')
    }
  }

  if (row.website && typeof row.website === 'string' && row.website.trim().length > 0) {
    try {
      new URL(row.website.trim())
    } catch {
      errors.push('Invalid website URL format')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Parse CSV file
 */
export async function parseCSV(file: File): Promise<BulkVendorRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names (case-insensitive, trim whitespace)
        const normalized = header.trim().toLowerCase()
        const mapping: Record<string, string> = {
          'vendor name': 'name',
          'company name': 'name',
          'name': 'name',
          'category': 'category',
          'location': 'location',
          'email': 'email',
          'phone': 'phone',
          'telephone': 'phone',
          'website': 'website',
          'url': 'website',
          'notes': 'notes',
          'note': 'notes',
          'comments': 'notes',
        }
        return mapping[normalized] || normalized
      },
      complete: (results) => {
        try {
          const vendors: BulkVendorRow[] = results.data
            .map((row: any, index: number) => {
              // Map common column variations
              const vendor: BulkVendorRow = {
                name: row.name || row['vendor name'] || row['company name'] || '',
                category: row.category || null,
                location: row.location || null,
                email: row.email || null,
                phone: row.phone || row.telephone || null,
                website: row.website || row.url || null,
                notes: row.notes || row.note || row.comments || null,
                rowNumber: index + 2, // +2 because index is 0-based and we skip header
              }

              // Validate row
              const validation = validateVendorRow(vendor)
              if (!validation.valid) {
                console.warn(`Row ${vendor.rowNumber} validation errors:`, validation.errors)
              }

              return vendor
            })
            .filter((v: BulkVendorRow) => v.name && v.name.trim().length > 0) // Filter out empty rows

          resolve(vendors)
        } catch (error) {
          reject(new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`))
      },
    })
  })
}

/**
 * Parse XLSX file
 */
export async function parseXLSX(file: File): Promise<BulkVendorRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) {
          reject(new Error('Excel file has no sheets'))
          return
        }

        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

        if (jsonData.length < 2) {
          reject(new Error('Excel file must have at least a header row and one data row'))
          return
        }

        // Get headers from first row
        const headers = (jsonData[0] || []).map((h: any) => String(h || '').trim().toLowerCase())
        const headerMapping: Record<string, string> = {
          'vendor name': 'name',
          'company name': 'name',
          'name': 'name',
          'category': 'category',
          'location': 'location',
          'email': 'email',
          'phone': 'phone',
          'telephone': 'phone',
          'website': 'website',
          'url': 'website',
          'notes': 'notes',
          'note': 'notes',
          'comments': 'notes',
        }

        // Map headers to normalized names
        const normalizedHeaders = headers.map((h) => headerMapping[h] || h)

        // Parse data rows
        const vendors: BulkVendorRow[] = jsonData
          .slice(1) // Skip header row
          .map((row: any[], index: number) => {
            const vendor: BulkVendorRow = {
              name: '',
              category: null,
              location: null,
              email: null,
              phone: null,
              website: null,
              notes: null,
              rowNumber: index + 2, // +2 because index is 0-based and we skip header
            }

            // Map values based on header positions
            normalizedHeaders.forEach((normalizedHeader, colIndex) => {
              const value = row[colIndex]
              if (value !== undefined && value !== null && value !== '') {
                const stringValue = String(value).trim()
                if (stringValue) {
                  switch (normalizedHeader) {
                    case 'name':
                      vendor.name = stringValue
                      break
                    case 'category':
                      vendor.category = stringValue
                      break
                    case 'location':
                      vendor.location = stringValue
                      break
                    case 'email':
                      vendor.email = stringValue
                      break
                    case 'phone':
                      vendor.phone = stringValue
                      break
                    case 'website':
                      vendor.website = stringValue
                      break
                    case 'notes':
                      vendor.notes = stringValue
                      break
                  }
                }
              }
            })

            return vendor
          })
          .filter((v: BulkVendorRow) => v.name && v.name.trim().length > 0) // Filter out empty rows

        resolve(vendors)
      } catch (error) {
        reject(new Error(`Failed to parse XLSX: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Deduplicate vendors by normalized name + email
 */
export function deduplicateVendors(vendors: BulkVendorRow[]): BulkVendorRow[] {
  const seen = new Set<string>()
  const deduplicated: BulkVendorRow[] = []

  for (const vendor of vendors) {
    const normalizedName = normalizeVendorName(vendor.name || '')
    const normalizedEmail = (vendor.email || '').toLowerCase().trim()
    const key = `${normalizedName}_${normalizedEmail}`

    if (!seen.has(key)) {
      seen.add(key)
      deduplicated.push(vendor)
    }
  }

  return deduplicated
}

