"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { TOAST_MESSAGES } from "../constants"
import { createTransferAction } from "../actions/createTransfer"

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  initialLines?: Array<{
    sku_id: string
    qty: number
  }>
  fromWarehouseId?: string
  toWarehouseId?: string
}

export function TransferModal({ isOpen, onClose, initialLines = [], fromWarehouseId: initialFrom, toWarehouseId: initialTo }: TransferModalProps) {
  const { user } = useUser()
  const [fromWarehouseId, setFromWarehouseId] = useState(initialFrom || "")
  const [toWarehouseId, setToWarehouseId] = useState(initialTo || "")
  const [lines, setLines] = useState(initialLines.length > 0 ? initialLines : [{
    sku_id: "",
    qty: 0,
  }])
  const [isCreating, setIsCreating] = useState(false)

  const handleAddLine = () => {
    setLines([...lines, {
      sku_id: "",
      qty: 0,
    }])
  }

  const handleUpdateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }
    setLines(newLines)
  }

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index))
  }

  const handleCreate = async () => {
    if (!user?.id) {
      toast.error("Please sign in")
      return
    }

    if (!fromWarehouseId || !toWarehouseId) {
      toast.error("Please enter both from and to warehouses")
      return
    }

    if (fromWarehouseId === toWarehouseId) {
      toast.error("From and to warehouses must be different")
      return
    }

    const validLines = lines.filter(l => l.sku_id && l.qty > 0)
    if (validLines.length === 0) {
      toast.error("Please add at least one valid line")
      return
    }

    setIsCreating(true)
    try {
      await createTransferAction({
        from_warehouse_id: fromWarehouseId,
        to_warehouse_id: toWarehouseId,
        lines: validLines,
        ownerUserId: user.id,
      })
      
      toast.success(TOAST_MESSAGES.TRANSFER_CREATED)
      onClose()
    } catch (error) {
      console.error('[TransferModal] Failed to create transfer:', error)
      toast.error(TOAST_MESSAGES.TRANSFER_ERROR)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Create Transfer</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">From Warehouse ID</label>
              <Input
                value={fromWarehouseId}
                onChange={(e) => setFromWarehouseId(e.target.value)}
                placeholder="Enter warehouse ID"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">To Warehouse ID</label>
              <Input
                value={toWarehouseId}
                onChange={(e) => setToWarehouseId(e.target.value)}
                placeholder="Enter warehouse ID"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Lines</label>
              <Button size="sm" variant="outline" onClick={handleAddLine}>
                Add Line
              </Button>
            </div>
            <div className="space-y-2">
              {lines.map((line, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 p-2 border border-gray-600 rounded">
                  <Input
                    placeholder="SKU"
                    value={line.sku_id}
                    onChange={(e) => handleUpdateLine(index, 'sku_id', e.target.value)}
                    className="col-span-2"
                  />
                  <div className="col-span-1 flex gap-1">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={line.qty}
                      onChange={(e) => handleUpdateLine(index, 'qty', parseInt(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveLine(index)}>
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Transfer'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

