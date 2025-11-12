"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { upsertForecastOverride } from "@/server/actions/workbench/forecast.override"

export function OverridesTab() {
  const [skuId, setSkuId] = useState("")
  const [horizonDate, setHorizonDate] = useState("")
  const [overrideValue, setOverrideValue] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skuId || !horizonDate || !overrideValue) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await upsertForecastOverride({
        skuId,
        horizonDate,
        overrideValue: parseFloat(overrideValue),
        reason: reason || undefined,
      });

      if (result.ok) {
        toast.success("Override saved successfully");
        setSkuId("");
        setHorizonDate("");
        setOverrideValue("");
        setReason("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[OverridesTab] Submit error:', error);
      toast.error("Failed to save override");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Forecast Overrides</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="skuId" className="text-gray-900 dark:text-white">SKU ID</Label>
              <Input
                id="skuId"
                value={skuId}
                onChange={(e) => setSkuId(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="horizonDate" className="text-gray-900 dark:text-white">Horizon Date</Label>
              <Input
                id="horizonDate"
                type="date"
                value={horizonDate}
                onChange={(e) => setHorizonDate(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="overrideValue" className="text-gray-900 dark:text-white">Override Value</Label>
              <Input
                id="overrideValue"
                type="number"
                step="0.01"
                value={overrideValue}
                onChange={(e) => setOverrideValue(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="reason" className="text-gray-900 dark:text-white">Reason (optional)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Override"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

