"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, ExternalLink, RefreshCw, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface ImportActivity {
  id: string
  filename: string
  status: "queued" | "running" | "success" | "error"
  rows?: number
  finishedAt?: string
}

interface ImportsActivityProps {
  data?: ImportActivity[]
  limit?: number
  onOpen?: (id: string) => void
  onStartImport?: () => void
  onViewAll?: () => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

export function ImportsActivity({
  data = [],
  limit,
  onOpen,
  onStartImport,
  onViewAll,
  isLoading = false,
  error,
  onRetry,
  className,
}: ImportsActivityProps) {
  const displayData = limit ? data.slice(0, limit) : data
  const hasMore = limit ? data.length > limit : false

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      success: "default",
      running: "secondary",
      queued: "secondary",
      error: "destructive",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>{status}</Badge>
    )
  }

  if (error) {
    return (
      <Card className={cn("dashboard-card", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("dashboard-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Imports
          </CardTitle>
          {onStartImport && (
            <Button size="sm" onClick={onStartImport} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: limit || 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))
        ) : displayData.length > 0 ? (
          displayData.map((importItem) => (
            <div
              key={importItem.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800",
                onOpen && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
              onClick={() => onOpen?.(importItem.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {importItem.filename}
                  </p>
                  {importItem.rows !== undefined && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {importItem.rows.toLocaleString()} rows
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(importItem.status)}
                {importItem.finishedAt && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {importItem.finishedAt}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
            No imports yet
          </div>
        )}

        {hasMore && onViewAll && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <Button variant="outline" size="sm" onClick={onViewAll} className="w-full" asChild>
              <Link href="/workbench">
                View all imports <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

