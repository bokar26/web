"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface PoSuggestion {
  sku: string
  location: string
  suggestedQty: number
  vendorId?: string
  vendorName?: string
  targetDate?: string
  unitCost?: number
  reason?: string
}

interface PoSuggestionsTableProps {
  data?: PoSuggestion[]
  limit?: number
  density?: "normal" | "compact"
  onCreatePO: (row: { sku: string; location: string; suggestedQty: number; vendorId?: string }) => void
  onViewAll?: () => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

export function PoSuggestionsTable({
  data = [],
  limit,
  density = "normal",
  onCreatePO,
  onViewAll,
  isLoading = false,
  error,
  onRetry,
  className,
}: PoSuggestionsTableProps) {
  const displayData = limit ? data.slice(0, limit) : data
  const hasMore = limit ? data.length > limit : false
  const isCompact = density === "compact"

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
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                SKU
              </TableHead>
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Location
              </TableHead>
              <TableHead className={cn("text-gray-900 dark:text-white text-right", isCompact && "text-xs")}>
                Qty
              </TableHead>
              {!isCompact && (
                <TableHead className="text-gray-900 dark:text-white">Vendor</TableHead>
              )}
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Target Date
              </TableHead>
              {!isCompact && (
                <TableHead className="text-gray-900 dark:text-white text-right">Unit Cost</TableHead>
              )}
              <TableHead className={cn("text-gray-900 dark:text-white text-right", isCompact && "text-xs")}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit || 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={isCompact ? 5 : 7}>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : displayData.length > 0 ? (
              displayData.map((suggestion, idx) => (
                <TableRow key={`${suggestion.sku}-${suggestion.location}-${idx}`} className={cn(isCompact && "h-10")}>
                  <TableCell className={cn("font-medium text-gray-900 dark:text-white", isCompact && "text-xs")}>
                    {suggestion.sku}
                  </TableCell>
                  <TableCell className={cn("text-gray-600 dark:text-gray-400", isCompact && "text-xs")}>
                    {suggestion.location}
                  </TableCell>
                  <TableCell className={cn("text-right text-gray-900 dark:text-white", isCompact && "text-xs")}>
                    {suggestion.suggestedQty.toLocaleString()}
                  </TableCell>
                  {!isCompact && (
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {suggestion.vendorName || "-"}
                    </TableCell>
                  )}
                  <TableCell className={cn("text-gray-600 dark:text-gray-400", isCompact && "text-xs")}>
                    {suggestion.targetDate || "-"}
                  </TableCell>
                  {!isCompact && (
                    <TableCell className="text-right text-gray-900 dark:text-white">
                      {suggestion.unitCost ? `$${suggestion.unitCost.toFixed(2)}` : "-"}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <Button
                      size={isCompact ? "sm" : "sm"}
                      onClick={() => onCreatePO({
                        sku: suggestion.sku,
                        location: suggestion.location,
                        suggestedQty: suggestion.suggestedQty,
                        vendorId: suggestion.vendorId,
                      })}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {isCompact ? "" : "Create PO"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isCompact ? 5 : 7} className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No PO suggestions available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && onViewAll && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onViewAll} asChild>
            <Link href="/workbench/inventory/purchase-orders">
              View all <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
