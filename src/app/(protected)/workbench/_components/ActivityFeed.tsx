"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, RefreshCw, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface ActivityFeedItem {
  id: string
  ts: string
  actor?: string
  action: string
  entityType: string
  entityId?: string
  details?: string
}

interface ActivityFeedProps {
  data?: ActivityFeedItem[]
  limit?: number
  onClickItem?: (entryId: string) => void
  onViewAll?: () => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

export function ActivityFeed({
  data = [],
  limit,
  onClickItem,
  onViewAll,
  isLoading = false,
  error,
  onRetry,
  className,
}: ActivityFeedProps) {
  const displayData = limit ? data.slice(0, limit) : data
  const hasMore = limit ? data.length > limit : false

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString()
    } catch {
      return ts
    }
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
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: limit || 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))
        ) : displayData.length > 0 ? (
          displayData.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800",
                onClickItem && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
              onClick={() => onClickItem?.(item.id)}
            >
              <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.action}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {item.entityType}
                  </Badge>
                  {item.entityId && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.entityId}
                    </span>
                  )}
                </div>
                {item.details && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {item.details}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {item.actor && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {item.actor}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(item.ts)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
            No activity yet
          </div>
        )}

        {hasMore && onViewAll && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <Button variant="outline" size="sm" onClick={onViewAll} className="w-full" asChild>
              <Link href="/logs">
                View all activity <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

