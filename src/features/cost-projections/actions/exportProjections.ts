'use server'

import { auth } from '@clerk/nextjs/server'

export interface ExportProjectionsRequest {
  scope: {
    period: string
    category: string
    supplier: string
    confidence: number
  }
  format: 'csv'
}

export interface ExportProjectionsResponse {
  ok: boolean
  url?: string
  error?: string
}

/**
 * Export cost projections to CSV
 */
export async function exportProjections(
  request: ExportProjectionsRequest
): Promise<ExportProjectionsResponse> {
  const { scope, format } = request

  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      console.error('[cost-projections/exportProjections] User not authenticated')
      return { ok: false, error: 'User not authenticated' }
    }

    // Generate CSV content
    const csvRows: string[] = []
    
    // Add scope metadata in first row
    csvRows.push(`Period,Category,Supplier,Confidence,Generated At`)
    csvRows.push(`${scope.period},${scope.category},${scope.supplier},${scope.confidence},${new Date().toISOString()}`)
    csvRows.push('') // Empty row separator
    
    // Add header row
    csvRows.push(`Month,Budget,Actual,Forecast,Variance`)
    
    // TODO: Fetch actual projection data from database
    // For now, add sample data
    const sampleData = [
      { month: 'Jan', budget: 450000, actual: 420000, forecast: 480000, variance: -6.7 },
      { month: 'Feb', budget: 480000, actual: 465000, forecast: 520000, variance: -3.1 },
      { month: 'Mar', budget: 520000, actual: 510000, forecast: 560000, variance: -1.9 },
    ]
    
    for (const row of sampleData) {
      csvRows.push(`${row.month},${row.budget},${row.actual},${row.forecast},${row.variance}`)
    }
    
    const csvContent = csvRows.join('\n')
    
    // In a real implementation, you would:
    // 1. Upload to Supabase Storage or S3
    // 2. Generate a signed URL
    // 3. Return the signed URL
    // For now, return a data URL that the client can use to trigger download
    const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
    
    return {
      ok: true,
      url: dataUrl,
    }
  } catch (error: any) {
    console.error('[cost-projections/exportProjections] Error:', error)
    return { ok: false, error: error.message || 'Failed to export projections' }
  }
}

