"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, RefreshCw, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InventoryWatchlistItem {
  sku: string
  location: string
  oh: number
  oo: number
  bo: number
  daysCover?: number
}

interface InventoryWatchlistProps {
  data?: InventoryWatchlistItem[]
  limit?: number
  onCreatePO: (payload: { sku: string; location: string }) => void
  onOpenSku: (sku: string, location?: string) => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

export function InventoryWatchlist({
  data = [],
  limit,
  onCreatePO,
  onOpenSku,
  isLoading = false,
  error,
  onRetry,
  className,
}: InventoryWatchlistProps) {
  const displayData = limit ? data.slice(0, limit) : data

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-white text-xs">SKU</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-xs">Location</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right text-xs">OH</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right text-xs">OO</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right text-xs">BO</TableHead>
              {displayData.some(item => item.daysCover !== undefined) && (
                <TableHead className="text-gray-900 dark:text-white text-right text-xs">Days</TableHead>
              )}
              <TableHead className="text-gray-900 dark:text-white text-right text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit || 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : displayData.length > 0 ? (
              displayData.map((item, idx) => {
                const isLowStock = item.oh < item.oo || item.bo > 0
                const isAtRisk = item.daysCover !== undefined && item.daysCover < 7

                return (
                  <TableRow key={`${item.sku}-${item.location}-${idx}`} className="h-10">
                    <TableCell className="font-medium text-gray-900 dark:text-white text-xs">
                      {item.sku}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 text-xs">
                      {item.location}
                    </TableCell>
                    <TableCell className="text-right text-gray-900 dark:text-white text-xs">
                      {item.oh.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-gray-400 text-xs">
                      {item.oo.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.bo > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {item.bo.toLocaleString()}
                        </Badge>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400 text-xs">0</span>
                      )}
                    </TableCell>
                    {displayData.some(i => i.daysCover !== undefined) && (
                      <TableCell className="text-right">
                        {item.daysCover !== undefined ? (
                          <Badge
                            variant={isAtRisk ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {item.daysCover}d
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isLowStock && (
                          <Button
                            size="sm"
                            onClick={() => onCreatePO({ sku: item.sku, location: item.location })}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white h-6 px-2"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenSku(item.sku, item.location)}
                          className="h-6 px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No inventory items to watch
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

