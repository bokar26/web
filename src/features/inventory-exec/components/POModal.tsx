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
import { createPOAction } from "../actions/createPO"

interface POModalProps {
  isOpen: boolean
  onClose: () => void
  initialLines?: Array<{
    sku_id: string
    qty: number
    price?: number
    warehouse_id: string
    promised_date?: string
  }>
  supplierId?: string
}

export function POModal({ isOpen, onClose, initialLines = [], supplierId: initialSupplierId }: POModalProps) {
  const { user } = useUser()
  const [supplierId, setSupplierId] = useState(initialSupplierId || "")
  const [lines, setLines] = useState(initialLines.length > 0 ? initialLines : [{
    sku_id: "",
    qty: 0,
    price: 0,
    warehouse_id: "",
    promised_date: "",
  }])
  const [isCreating, setIsCreating] = useState(false)

  const handleAddLine = () => {
    setLines([...lines, {
      sku_id: "",
      qty: 0,
      price: 0,
      warehouse_id: "",
      promised_date: "",
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

    if (!supplierId) {
      toast.error("Please enter supplier ID")
      return
    }

    const validLines = lines.filter(l => l.sku_id && l.qty > 0 && l.warehouse_id)
    if (validLines.length === 0) {
      toast.error("Please add at least one valid line")
      return
    }

    setIsCreating(true)
    try {
      await createPOAction({
        supplier_id: supplierId,
        lines: validLines.map(l => ({
          sku_id: l.sku_id,
          qty: l.qty,
          price: l.price || 0,
          warehouse_id: l.warehouse_id,
          promised_date: l.promised_date || undefined,
        })),
        ownerUserId: user.id,
      })
      
      toast.success(TOAST_MESSAGES.PO_CREATED)
      onClose()
    } catch (error) {
      console.error('[POModal] Failed to create PO:', error)
      toast.error(TOAST_MESSAGES.PO_ERROR)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Create Purchase Order</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Supplier ID</label>
            <Input
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              placeholder="Enter supplier ID"
              className="mt-1"
            />
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
                <div key={index} className="grid grid-cols-5 gap-2 p-2 border border-gray-600 rounded">
                  <Input
                    placeholder="SKU"
                    value={line.sku_id}
                    onChange={(e) => handleUpdateLine(index, 'sku_id', e.target.value)}
                    className="col-span-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={line.qty}
                    onChange={(e) => handleUpdateLine(index, 'qty', parseInt(e.target.value) || 0)}
                    className="col-span-1"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={line.price}
                    onChange={(e) => handleUpdateLine(index, 'price', parseFloat(e.target.value) || 0)}
                    className="col-span-1"
                  />
                  <Input
                    placeholder="Warehouse ID"
                    value={line.warehouse_id}
                    onChange={(e) => handleUpdateLine(index, 'warehouse_id', e.target.value)}
                    className="col-span-1"
                  />
                  <div className="col-span-1 flex gap-1">
                    <Input
                      type="date"
                      value={line.promised_date}
                      onChange={(e) => handleUpdateLine(index, 'promised_date', e.target.value)}
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
            {isCreating ? 'Creating...' : 'Create PO'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

