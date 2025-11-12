"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, Package, MoreVertical, ExternalLink, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface Shipment {
  id: string
  orderRef?: string
  lane?: string
  status: "planned" | "booked" | "in_transit" | "delivered"
  etd?: string
  eta?: string
  carrier?: string
  ffName?: string
  valueUsd?: number
}

interface ShipmentsTableProps {
  data?: Shipment[]
  limit?: number
  density?: "normal" | "compact"
  onBook: (id?: string) => void
  onUploadDocs: (id: string) => void
  onMarkReceived: (id: string) => void
  onViewAll?: () => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

export function ShipmentsTable({
  data = [],
  limit,
  density = "normal",
  onBook,
  onUploadDocs,
  onMarkReceived,
  onViewAll,
  isLoading = false,
  error,
  onRetry,
  className,
}: ShipmentsTableProps) {
  const displayData = limit ? data.slice(0, limit) : data
  const hasMore = limit ? data.length > limit : false
  const isCompact = density === "compact"

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      planned: "secondary",
      booked: "default",
      in_transit: "default",
      delivered: "default",
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
                ID
              </TableHead>
              {!isCompact && (
                <TableHead className="text-gray-900 dark:text-white">Order Ref</TableHead>
              )}
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Lane
              </TableHead>
              <TableHead className={cn("text-gray-900 dark:text-white", isCompact && "text-xs")}>
                Status
              </TableHead>
              {!isCompact && (
                <>
                  <TableHead className="text-gray-900 dark:text-white">ETD</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">ETA</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Carrier/FF</TableHead>
                </>
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
                  <TableCell colSpan={isCompact ? 4 : 8}>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : displayData.length > 0 ? (
              displayData.map((shipment) => (
                <TableRow key={shipment.id} className={cn(isCompact && "h-10")}>
                  <TableCell className={cn("font-medium text-gray-900 dark:text-white", isCompact && "text-xs")}>
                    {shipment.id}
                  </TableCell>
                  {!isCompact && (
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {shipment.orderRef || "-"}
                    </TableCell>
                  )}
                  <TableCell className={cn("text-gray-600 dark:text-gray-400", isCompact && "text-xs")}>
                    {shipment.lane || "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                  {!isCompact && (
                    <>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {shipment.etd || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {shipment.eta || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {shipment.carrier || shipment.ffName || "-"}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size={isCompact ? "sm" : "sm"}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {shipment.status === "planned" && (
                          <DropdownMenuItem onClick={() => onBook(shipment.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Book/Confirm
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onUploadDocs(shipment.id)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Docs
                        </DropdownMenuItem>
                        {shipment.status === "in_transit" && (
                          <DropdownMenuItem onClick={() => onMarkReceived(shipment.id)}>
                            <Package className="h-4 w-4 mr-2" />
                            Mark Received
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isCompact ? 4 : 8} className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No shipments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && onViewAll && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onViewAll} asChild>
            <Link href="/workbench/shipping">
              View all <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
