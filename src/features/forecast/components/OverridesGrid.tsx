"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { applyOverrides } from "../actions/applyOverrides"
import { toast } from "sonner"
import { Save, RotateCcw, Plus, Minus } from "lucide-react"

interface ForecastOverride {
  id: string
  skuId: string
  location: string | null
  baseForecast: number
  overrideValue: number | null
  effectiveForecast: number
  reason: string | null
  lastUpdated: string
}

interface OverridesGridProps {
  runId: string | null
}

export function OverridesGrid({ runId }: OverridesGridProps) {
  const [overrides, setOverrides] = useState<ForecastOverride[]>([])
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [percentAdjustment, setPercentAdjustment] = useState("")
  const [selectedOverride, setSelectedOverride] = useState<ForecastOverride | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Mock data for now - in production, fetch from server action
  useEffect(() => {
    if (!runId) {
      setOverrides([])
      return
    }

    // Placeholder data - replace with actual fetch
    setOverrides([
      {
        id: "1",
        skuId: "SKU-001",
        location: "Warehouse A",
        baseForecast: 1000,
        overrideValue: null,
        effectiveForecast: 1000,
        reason: null,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "2",
        skuId: "SKU-002",
        location: "Warehouse B",
        baseForecast: 1500,
        overrideValue: 1600,
        effectiveForecast: 1600,
        reason: "Promotional campaign",
        lastUpdated: new Date().toISOString(),
      },
    ])
  }, [runId])

  const handleOverrideChange = (id: string, value: string) => {
    setOverrides((prev) =>
      prev.map((override) => {
        if (override.id === id) {
          const numValue = value === "" ? null : parseFloat(value)
          return {
            ...override,
            overrideValue: numValue,
            effectiveForecast: numValue ?? override.baseForecast,
          }
        }
        return override
      })
    )
  }

  const handleApplyPercentAdjustment = () => {
    if (!percentAdjustment || selectedRows.size === 0) return

    const percent = parseFloat(percentAdjustment)
    if (isNaN(percent)) return

    setOverrides((prev) =>
      prev.map((override) => {
        if (selectedRows.has(override.id)) {
          const adjustment = (override.baseForecast * percent) / 100
          const newValue = override.baseForecast + adjustment
          return {
            ...override,
            overrideValue: newValue,
            effectiveForecast: newValue,
          }
        }
        return override
      })
    )
    setPercentAdjustment("")
  }

  const handleSaveOverrides = async () => {
    if (!runId) {
      toast.error("No forecast run selected")
      return
    }

    setIsSaving(true)
    try {
      await applyOverrides({ runId })
      toast.success("Overrides saved successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to save overrides")
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetToModel = () => {
    setOverrides((prev) =>
      prev.map((override) => ({
        ...override,
        overrideValue: null,
        effectiveForecast: override.baseForecast,
      }))
    )
    setSelectedRows(new Set())
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (!runId) {
    return (
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="text-center text-gray-600 dark:text-white py-8">
            Run forecast first to view and edit overrides
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="dashboard-card">
        <CardContent className="p-6">
          {/* Bulk Actions Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="% +/-"
                value={percentAdjustment}
                onChange={(e) => setPercentAdjustment(e.target.value)}
                className="w-24 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                disabled={selectedRows.size === 0}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyPercentAdjustment}
                disabled={selectedRows.size === 0 || !percentAdjustment}
                className="text-gray-900 dark:text-white border-gray-600"
              >
                Apply to Selected ({selectedRows.size})
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToModel}
                className="text-gray-900 dark:text-white border-gray-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Model
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveOverrides}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Overrides"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-sm font-medium text-white">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === overrides.length && overrides.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(new Set(overrides.map((o) => o.id)))
                        } else {
                          setSelectedRows(new Set())
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white">SKU</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white">Location</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white">Base Forecast</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white">Override</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white">Effective</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {overrides.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-600 dark:text-white">
                      No overrides yet
                    </td>
                  </tr>
                ) : (
                  overrides.map((override) => (
                    <tr
                      key={override.id}
                      className="border-b border-gray-600 hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => {
                        setSelectedOverride(override)
                        setIsDrawerOpen(true)
                      }}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(override.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            toggleRowSelection(override.id)
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-white">{override.skuId}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-white">
                        {override.location || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-white text-right">
                        {override.baseForecast.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Input
                          type="number"
                          value={override.overrideValue ?? ""}
                          onChange={(e) => handleOverrideChange(override.id, e.target.value)}
                          className="w-24 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-white text-right">
                        {override.effectiveForecast.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-white">
                        {override.reason || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-white">
                        {new Date(override.lastUpdated).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Override Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="bg-gray-900 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Override Details</SheetTitle>
          </SheetHeader>
          {selectedOverride && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400">SKU</label>
                <p className="text-white">{selectedOverride.skuId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Location</label>
                <p className="text-white">{selectedOverride.location || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Base Forecast</label>
                <p className="text-white">{selectedOverride.baseForecast.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Override Value</label>
                <p className="text-white">
                  {selectedOverride.overrideValue?.toLocaleString() || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Effective Forecast</label>
                <p className="text-white">{selectedOverride.effectiveForecast.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Reason</label>
                <p className="text-white">{selectedOverride.reason || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Last Updated</label>
                <p className="text-white">
                  {new Date(selectedOverride.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

