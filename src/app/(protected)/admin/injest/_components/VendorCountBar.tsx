"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getVendorCount } from "../actions"
import { Loader2 } from "lucide-react"

interface VendorCountBarProps {
  refreshTrigger?: number
}

export function VendorCountBar({ refreshTrigger }: VendorCountBarProps) {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCount = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getVendorCount()
      if (result.error) {
        setError(result.error)
      } else {
        setCount(result.totalVendors)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendor count')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCount()
  }, [refreshTrigger])

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Vendors in Database:
            </span>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : error ? (
              <span className="text-sm text-red-500 dark:text-red-400">{error}</span>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {count !== null ? count.toLocaleString() : '—'}
              </span>
            )}
          </div>
          <button
            onClick={fetchCount}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </CardContent>
    </Card>
  )
}


