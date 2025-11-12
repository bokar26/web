"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Copy, X, Truck, MoreVertical, ExternalLink, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface Order {
  id: string
  customer?: string
  date?: string
  status?: string
  totalUsd?: number
}

interface OrdersTableProps {
  data?: Order[]
  limit?: number
  density?: "normal" | "compact"
  onOpen: (id: string) => void
  onCreateShipment: (orderId: string) => void
  onViewAll?: () => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

export function OrdersTable({
  data = [],
  limit,
  density = "normal",
  onOpen,
  onCreateShipment,
  onViewAll,
  isLoading = false,
  error,
  onRetry,
  className,
}: OrdersTableProps) {
  const displayData = limit ? data.slice(0, limit) : data
  const hasMore = limit ? data.length > limit : false
  const isCompact = density === "compact"

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive",
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
                Order ID
              </TableHead>
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Customer
              </TableHead>
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Date
              </TableHead>
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Status
              </TableHead>
              {!isCompact && (
                <TableHead className="text-gray-900 dark:text-white text-right">Value</TableHead>
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
                  <TableCell colSpan={isCompact ? 5 : 6}>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : displayData.length > 0 ? (
              displayData.map((order) => (
                <TableRow key={order.id} className={cn(isCompact && "h-10")}>
                  <TableCell className={cn("font-medium text-gray-900 dark:text-white", isCompact && "text-xs")}>
                    {order.id}
                  </TableCell>
                  <TableCell className={cn("text-gray-600 dark:text-gray-400", isCompact && "text-xs")}>
                    {order.customer || "-"}
                  </TableCell>
                  <TableCell className={cn("text-gray-600 dark:text-gray-400", isCompact && "text-xs")}>
                    {order.date || "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  {!isCompact && (
                    <TableCell className="text-right text-gray-900 dark:text-white">
                      {order.totalUsd ? `$${order.totalUsd.toLocaleString()}` : "-"}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size={isCompact ? "sm" : "sm"}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onOpen(order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCreateShipment(order.id)}>
                          <Truck className="h-4 w-4 mr-2" />
                          Create Shipment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isCompact ? 5 : 6} className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No orders found
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
