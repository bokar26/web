"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { simulateCost } from "@/server/actions/workbench/costs.simulate"
import { raisePO } from "@/server/actions/workbench/po.raise"
import { DollarSign } from "lucide-react"

export function CostsTab() {
  const [skuIds, setSkuIds] = useState("")
  const [quantity, setQuantity] = useState("")
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isRaisingPO, setIsRaisingPO] = useState(false)

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();

    const skuIdArray = skuIds.split(',').map((s) => s.trim()).filter(Boolean);
    if (skuIdArray.length === 0) {
      toast.error("Please provide SKU IDs");
      return;
    }

    setIsSimulating(true);
    try {
      const result = await simulateCost({
        skuIds: skuIdArray,
        quantity: quantity ? parseFloat(quantity) : undefined,
      });

      if (result.ok) {
        setSimulationResult(result.data);
        toast.success("Cost simulation completed");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[CostsTab] Simulation error:', error);
      toast.error("Failed to simulate cost");
    } finally {
      setIsSimulating(false);
    }
  }

  const handleRaisePO = async () => {
    if (!simulationResult) {
      toast.error("Please run a simulation first");
      return;
    }

    setIsRaisingPO(true);
    try {
      // In a real implementation, we'd get supplier ID from user input
      const result = await raisePO({
        supplierId: "supplier-1", // Placeholder
        lines: skuIds.split(',').map((skuId, idx) => ({
          skuId: skuId.trim(),
          quantity: quantity ? parseFloat(quantity) : 1,
          unitPrice: simulationResult.breakdown[0]?.amount || 0,
        })),
      });

      if (result.ok) {
        toast.success(`PO raised with ${result.data.lineCount} lines`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[CostsTab] Raise PO error:', error);
      toast.error("Failed to raise PO");
    } finally {
      setIsRaisingPO(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-4">
            <div>
              <Label htmlFor="costSkuIds" className="text-gray-900 dark:text-white">SKU IDs (comma-separated)</Label>
              <Input
                id="costSkuIds"
                value={skuIds}
                onChange={(e) => setSkuIds(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="costQuantity" className="text-gray-900 dark:text-white">Quantity (optional)</Label>
              <Input
                id="costQuantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isSimulating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSimulating ? "Simulating..." : "Simulate Cost"}
            </Button>
          </form>

          {simulationResult && (
            <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Cost: {simulationResult.currency} {simulationResult.totalCost.toFixed(2)}
              </div>
              <div className="space-y-1">
                {simulationResult.breakdown.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{item.category}</span>
                    <span>{item.currency} {item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleRaisePO}
                disabled={isRaisingPO}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isRaisingPO ? "Raising PO..." : "Raise PO"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

