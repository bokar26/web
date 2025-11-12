"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useShipmentCosts } from "../../hooks/useShipmentData"
import { upsertCostAction } from "../../actions/upsertCost"
import { VARIANCE_THRESHOLD_PCT, TOAST_MESSAGES } from "../../constants"
import { formatMoney } from "../../utils/format"

interface CostsTabProps {
  shipmentId?: string
}

export function CostsTab({ shipmentId }: CostsTabProps) {
  const { user } = useUser()
  const { data: costs, totals, loading, error } = useShipmentCosts(shipmentId)
  const [editingCosts, setEditingCosts] = useState<Record<string, { planned?: number; actual?: number }>>({})
  const [savingCosts, setSavingCosts] = useState<Record<string, boolean>>({})

  const handleSaveCost = async (costId: string, costType: string) => {
    if (!shipmentId || !user?.id) {
      toast.error("Please sign in to update costs")
      return
    }

    const edits = editingCosts[costId]
    if (!edits || (!edits.planned && !edits.actual)) {
      return
    }

    setSavingCosts((prev) => ({ ...prev, [costId]: true }))
    try {
      await upsertCostAction({
        shipmentId,
        costType,
        plannedUSD: edits.planned,
        actualUSD: edits.actual,
        ownerUserId: user.id,
      })

      toast.success(TOAST_MESSAGES.COST_RECORDED)
      // Clear editing state
      setEditingCosts((prev) => {
        const next = { ...prev }
        delete next[costId]
        return next
      })
      // Data will refresh via hook
    } catch (error) {
      console.error('[CostsTab] Failed to save cost:', error)
      toast.error(error instanceof Error ? error.message : TOAST_MESSAGES.COST_ERROR)
    } finally {
      setSavingCosts((prev) => ({ ...prev, [costId]: false }))
    }
  }

  const handleEditCost = (costId: string, field: 'planned' | 'actual', value: number) => {
    setEditingCosts((prev) => ({
      ...prev,
      [costId]: {
        ...prev[costId],
        [field]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Loading costs...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        Error: {error.message}
      </div>
    )
  }

  const hasVarianceWarning = Math.abs(totals.variance) >= VARIANCE_THRESHOLD_PCT

  return (
    <div className="space-y-4">
      {/* Totals Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-xs text-gray-400 mb-1">Planned Total</div>
            <div className="text-lg font-semibold text-white">
              {formatMoney(totals.planned)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-xs text-gray-400 mb-1">Actual Total</div>
            <div className="text-lg font-semibold text-white">
              {formatMoney(totals.actual)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-xs text-gray-400 mb-1">Variance</div>
            <div className="flex items-center gap-2">
              <div className={`text-lg font-semibold ${totals.variance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totals.variance >= 0 ? '+' : ''}{totals.variance.toFixed(1)}%
              </div>
              {hasVarianceWarning && (
                <Badge variant="destructive" className="text-xs">
                  Alert
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variance Warning */}
      {hasVarianceWarning && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            Cost variance ({totals.variance >= 0 ? '+' : ''}{totals.variance.toFixed(1)}%) exceeds threshold ({VARIANCE_THRESHOLD_PCT}%)
          </AlertDescription>
        </Alert>
      )}

      {/* Costs Table */}
      {costs.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center text-gray-400">
            No costs yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2 text-gray-400">Type</th>
                <th className="text-left p-2 text-gray-400">Planned</th>
                <th className="text-left p-2 text-gray-400">Actual</th>
                <th className="text-left p-2 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => {
                const isEditing = editingCosts[cost.id] !== undefined
                const isSaving = savingCosts[cost.id] === true
                const edits = editingCosts[cost.id] || {}
                const plannedValue = edits.planned !== undefined ? edits.planned : (Number(cost.planned_amount) || 0)
                const actualValue = edits.actual !== undefined ? edits.actual : (Number(cost.actual_amount) || 0)

                return (
                  <tr key={cost.id} className="border-b border-gray-800">
                    <td className="p-2 text-white">{cost.cost_type}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={plannedValue}
                        onChange={(e) => handleEditCost(cost.id, 'planned', parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-sm"
                        disabled={isSaving}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={actualValue}
                        onChange={(e) => handleEditCost(cost.id, 'actual', parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-sm"
                        disabled={isSaving}
                      />
                    </td>
                    <td className="p-2">
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveCost(cost.id, cost.cost_type)}
                          disabled={isSaving}
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

