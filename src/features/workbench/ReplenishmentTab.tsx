"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createReplenishmentPlan } from "@/server/actions/workbench/replenishment.plan"

export function ReplenishmentTab() {
  const [skuIds, setSkuIds] = useState("")
  const [warehouseId, setWarehouseId] = useState("")
  const [safetyStock, setSafetyStock] = useState("")
  const [reorderPoint, setReorderPoint] = useState("")
  const [applyPolicies, setApplyPolicies] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const skuIdArray = skuIds.split(',').map((s) => s.trim()).filter(Boolean);
    if (skuIdArray.length === 0 || !warehouseId) {
      toast.error("Please provide SKU IDs and warehouse ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReplenishmentPlan({
        skuIds: skuIdArray,
        warehouseId,
        parameters: {
          safetyStock: safetyStock ? parseFloat(safetyStock) : undefined,
          reorderPoint: reorderPoint ? parseFloat(reorderPoint) : undefined,
        },
        applyPolicies,
      });

      if (result.ok) {
        toast.success(`Replenishment plan created with ${result.data.lineCount} lines`);
        setSkuIds("");
        setWarehouseId("");
        setSafetyStock("");
        setReorderPoint("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[ReplenishmentTab] Submit error:', error);
      toast.error("Failed to create replenishment plan");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Create Replenishment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="skuIds" className="text-gray-900 dark:text-white">SKU IDs (comma-separated)</Label>
              <Input
                id="skuIds"
                value={skuIds}
                onChange={(e) => setSkuIds(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                placeholder="SKU1, SKU2, SKU3"
                required
              />
            </div>

            <div>
              <Label htmlFor="warehouseId" className="text-gray-900 dark:text-white">Warehouse ID</Label>
              <Input
                id="warehouseId"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="safetyStock" className="text-gray-900 dark:text-white">Safety Stock (optional)</Label>
              <Input
                id="safetyStock"
                type="number"
                value={safetyStock}
                onChange={(e) => setSafetyStock(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="reorderPoint" className="text-gray-900 dark:text-white">Reorder Point (optional)</Label>
              <Input
                id="reorderPoint"
                type="number"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="applyPolicies"
                checked={applyPolicies}
                onChange={(e) => setApplyPolicies(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <Label htmlFor="applyPolicies" className="text-gray-900 dark:text-white">
                Apply reorder policies
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

