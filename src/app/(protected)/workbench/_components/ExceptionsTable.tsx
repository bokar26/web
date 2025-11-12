"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, User, MoreVertical, ExternalLink, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface Exception {
  id: string
  type: string
  severity: "low" | "med" | "high"
  entityType: "SKU" | "Order" | "Shipment" | "PO"
  entityId: string
  message: string
  createdAt: string
  status: "open" | "snoozed" | "resolved"
}

interface ExceptionsTableProps {
  data?: Exception[]
  limit?: number
  density?: "normal" | "compact"
  filters?: { severity?: string[]; status?: string[] }
  onResolve: (id: string) => void
  onSnooze: (id: string, until: Date) => void
  onAssign?: (id: string, userId: string) => void
  onViewAll?: () => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

export function ExceptionsTable({
  data = [],
  limit,
  density = "normal",
  filters,
  onResolve,
  onSnooze,
  onAssign,
  onViewAll,
  isLoading = false,
  error,
  onRetry,
  className,
}: ExceptionsTableProps) {
  // Apply filters
  let filteredData = data
  if (filters?.severity && filters.severity.length > 0) {
    filteredData = filteredData.filter(e => filters.severity!.includes(e.severity))
  }
  if (filters?.status && filters.status.length > 0) {
    filteredData = filteredData.filter(e => filters.status!.includes(e.status))
  }

  const displayData = limit ? filteredData.slice(0, limit) : filteredData
  const hasMore = limit ? filteredData.length > limit : false
  const isCompact = density === "compact"

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      high: "destructive",
      med: "default",
      low: "secondary",
    }
    return (
      <Badge variant={variants[severity] || "secondary"}>{severity}</Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary"> = {
      open: "secondary",
      resolved: "default",
      snoozed: "secondary",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>{status}</Badge>
    )
  }

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
                Type
              </TableHead>
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Severity
              </TableHead>
              {!isCompact && (
                <TableHead className="text-gray-900 dark:text-white">Entity</TableHead>
              )}
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Message
              </TableHead>
              {!isCompact && (
                <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
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
                  <TableCell colSpan={isCompact ? 4 : 6}>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : displayData.length > 0 ? (
              displayData.map((exception) => (
                <TableRow key={exception.id} className={cn(isCompact && "h-10")}>
                  <TableCell className={cn("font-medium text-gray-900 dark:text-white", isCompact && "text-xs")}>
                    {exception.type}
                  </TableCell>
                  <TableCell>{getSeverityBadge(exception.severity)}</TableCell>
                  {!isCompact && (
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {exception.entityType} {exception.entityId}
                    </TableCell>
                  )}
                  <TableCell className={cn("text-gray-600 dark:text-gray-400", isCompact && "text-xs truncate max-w-xs")}>
                    {exception.message}
                  </TableCell>
                  {!isCompact && (
                    <TableCell>{getStatusBadge(exception.status)}</TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size={isCompact ? "sm" : "sm"}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onResolve(exception.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSnooze(exception.id, new Date(Date.now() + 24 * 60 * 60 * 1000))}>
                          <Clock className="h-4 w-4 mr-2" />
                          Snooze
                        </DropdownMenuItem>
                        {onAssign && (
                          <DropdownMenuItem onClick={() => onAssign(exception.id, "user-id")}>
                            <User className="h-4 w-4 mr-2" />
                            Assign
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isCompact ? 4 : 6} className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No exceptions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && onViewAll && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onViewAll} asChild>
            <Link href="/workbench/procurement">
              View all <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
