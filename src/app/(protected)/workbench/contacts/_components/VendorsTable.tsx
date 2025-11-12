"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Edit, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { listVendors } from "@/app/(protected)/dashboard/manage/vendors/actions"
import { SupabaseVendor } from "@/types/vendors"

interface VendorsTableProps {
  onViewDetails?: (vendorId: string) => void
  onEdit?: (vendorId: string) => void
}

export function VendorsTable({ onViewDetails, onEdit }: VendorsTableProps) {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [vendors, setVendors] = useState<SupabaseVendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVendors = async () => {
      if (!user?.id) return

      try {
        const result = await listVendors({
          ownerUserId: user.id,
          page: 1,
          pageSize: 100,
          q: searchQuery || undefined,
        })
        setVendors(result.data || [])
      } catch (error) {
        console.error("[VendorsTable] Failed to load vendors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVendors()
  }, [user?.id, searchQuery])

  const getSourceBadge = (source: string) => {
    const variants: Record<string, "default" | "secondary"> = {
      supplier: "default",
      warehouse: "secondary",
      logistics: "default",
    }
    return <Badge variant={variants[source] || "secondary"}>{source}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading vendors...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-white">Name</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Source</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Contact</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Country</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {vendor.name}
                  </TableCell>
                  <TableCell>{getSourceBadge(vendor.source)}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {vendor.email || vendor.phone || "-"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {vendor.country || "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails?.(vendor.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(vendor.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-600 dark:text-gray-400">
                  No vendors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

