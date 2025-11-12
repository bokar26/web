"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRightLeft } from "lucide-react"

// Mock data - replace with actual Supabase query
const mockInventory = [
  {
    id: "1",
    sku: "SKU-001",
    location: "Warehouse A",
    onHand: 500,
    onOrder: 200,
    backorder: 0,
    reorderPoint: 300,
    leadTime: 7,
    vendor: "Supplier X",
  },
  {
    id: "2",
    sku: "SKU-002",
    location: "Warehouse B",
    onHand: 150,
    onOrder: 0,
    backorder: 50,
    reorderPoint: 200,
    leadTime: 10,
    vendor: "Supplier Y",
  },
]

interface InventoryTableProps {
  onCreatePO?: (skuId: string, location: string) => void
  onTransfer?: (skuId: string, location: string) => void
}

export function InventoryTable({ onCreatePO, onTransfer }: InventoryTableProps) {
  const [inventory] = useState(mockInventory)

  const getStockStatus = (onHand: number, reorderPoint: number, backorder: number) => {
    if (backorder > 0) return { label: "Backorder", variant: "destructive" as const }
    if (onHand < reorderPoint) return { label: "Low Stock", variant: "default" as const }
    return { label: "In Stock", variant: "secondary" as const }
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-white">SKU</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Location</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">On Hand</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">On Order</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Backorder</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Reorder Point</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Lead Time (days)</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Vendor</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? (
              inventory.map((item) => {
                const status = getStockStatus(item.onHand, item.reorderPoint, item.backorder)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {item.sku}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {item.location}
                    </TableCell>
                    <TableCell className="text-right text-gray-900 dark:text-white">
                      {item.onHand}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-gray-400">
                      {item.onOrder}
                    </TableCell>
                    <TableCell className="text-right text-red-600 dark:text-red-400">
                      {item.backorder}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-gray-400">
                      {item.reorderPoint}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-gray-400">
                      {item.leadTime}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {item.vendor}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCreatePO?.(item.sku, item.location)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          PO
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onTransfer?.(item.sku, item.location)}
                        >
                          <ArrowRightLeft className="h-4 w-4 mr-1" />
                          Transfer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-600 dark:text-gray-400">
                  No inventory data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

