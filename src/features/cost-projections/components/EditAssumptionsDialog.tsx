"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAssumptions, type Assumptions } from "../actions/updateAssumptions"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface EditAssumptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scope: 'global' | 'supplier'
  supplierId?: string
  onSave?: () => void
}

export function EditAssumptionsDialog({
  open,
  onOpenChange,
  scope,
  supplierId,
  onSave,
}: EditAssumptionsDialogProps) {
  const { user } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const [assumptions, setAssumptions] = useState<Assumptions>({
    fxRate: 1.0,
    freightIndex: 100,
    fuelSurcharge: 0,
    dutyPct: 0,
    shrinkPct: 0,
    overheadBasis: 0,
    leadTimeDays: 0,
  })
  const [selectedScope, setSelectedScope] = useState<'global' | 'supplier'>(scope)

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("Please sign in to save assumptions")
      return
    }

    setIsSaving(true)
    try {
      const result = await updateAssumptions({
        scope: selectedScope,
        supplierId: selectedScope === 'supplier' ? supplierId : undefined,
        assumptions,
        ownerUserId: user.id,
      })

      if (result.ok) {
        toast.success("Assumptions saved successfully")
        onSave?.()
        onOpenChange(false)
      } else {
        toast.error(result.error || "Failed to save assumptions")
      }
    } catch (error: any) {
      console.error('[EditAssumptionsDialog] Error:', error)
      toast.error(error.message || "Failed to save assumptions")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Cost Assumptions</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update cost projection assumptions for {selectedScope === 'global' ? 'all suppliers' : 'this supplier'}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Scope Selector */}
          <div>
            <Label htmlFor="scope" className="text-gray-700 dark:text-white">Scope</Label>
            <Select value={selectedScope} onValueChange={(value: 'global' | 'supplier') => setSelectedScope(value)}>
              <SelectTrigger className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assumptions Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fxRate" className="text-gray-700 dark:text-white">FX Rate</Label>
              <Input
                id="fxRate"
                type="number"
                step="0.01"
                value={assumptions.fxRate}
                onChange={(e) => setAssumptions({ ...assumptions, fxRate: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="freightIndex" className="text-gray-700 dark:text-white">Freight Index</Label>
              <Input
                id="freightIndex"
                type="number"
                value={assumptions.freightIndex}
                onChange={(e) => setAssumptions({ ...assumptions, freightIndex: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="fuelSurcharge" className="text-gray-700 dark:text-white">Fuel Surcharge (%)</Label>
              <Input
                id="fuelSurcharge"
                type="number"
                step="0.1"
                value={assumptions.fuelSurcharge}
                onChange={(e) => setAssumptions({ ...assumptions, fuelSurcharge: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="dutyPct" className="text-gray-700 dark:text-white">Duty (%)</Label>
              <Input
                id="dutyPct"
                type="number"
                step="0.1"
                value={assumptions.dutyPct}
                onChange={(e) => setAssumptions({ ...assumptions, dutyPct: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="shrinkPct" className="text-gray-700 dark:text-white">Shrink (%)</Label>
              <Input
                id="shrinkPct"
                type="number"
                step="0.1"
                value={assumptions.shrinkPct}
                onChange={(e) => setAssumptions({ ...assumptions, shrinkPct: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="overheadBasis" className="text-gray-700 dark:text-white">Overhead Basis</Label>
              <Input
                id="overheadBasis"
                type="number"
                step="0.01"
                value={assumptions.overheadBasis}
                onChange={(e) => setAssumptions({ ...assumptions, overheadBasis: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="leadTimeDays" className="text-gray-700 dark:text-white">Lead Time (Days)</Label>
              <Input
                id="leadTimeDays"
                type="number"
                value={assumptions.leadTimeDays}
                onChange={(e) => setAssumptions({ ...assumptions, leadTimeDays: parseInt(e.target.value) || 0 })}
                className="mt-1 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

