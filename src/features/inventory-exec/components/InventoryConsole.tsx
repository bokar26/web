"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { INVENTORY_TABS, InventoryTab, TOAST_MESSAGES, PLAN_STATUSES, PO_STATUSES, TRANSFER_STATUSES, COUNT_STATUSES } from "../constants"
import { Package, ShoppingCart, ArrowRightLeft, SlidersHorizontal, ClipboardList, Activity } from "lucide-react"
import { getInventoryExecutionData } from "../actions/getInventoryExecutionData"
import { dismissPlan } from "../actions/dismissPlan"
import type { ReplenishmentPlan, PurchaseOrder, Transfer, StockAdjustment, CycleCount, AuditLog } from "../types"

interface InventoryConsoleProps {
  onClose?: () => void
}

export function InventoryConsole({ onClose }: InventoryConsoleProps) {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<InventoryTab>(INVENTORY_TABS.PLANS)
  const [plans, setPlans] = useState<ReplenishmentPlan[]>([])
  const [pos, setPos] = useState<PurchaseOrder[]>([])
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([])
  const [counts, setCounts] = useState<CycleCount[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const data = await getInventoryExecutionData()
        setPlans(data.plans)
        setPos(data.pos)
        setTransfers(data.transfers)
        setAdjustments(data.adjustments)
        setCounts(data.counts)
        setAuditLogs(data.auditLogs)
      } catch (error) {
        console.error('[InventoryConsole] Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const handleDismissPlan = async (planId: string) => {
    if (!user?.id) {
      toast.error("Please sign in")
      return
    }

    try {
      await dismissPlan({ planId, ownerUserId: user.id })
      toast.success(TOAST_MESSAGES.PLAN_DISMISSED)
      // Refresh plans
      const data = await getInventoryExecutionData()
      setPlans(data.plans)
    } catch (error) {
      console.error('[InventoryConsole] Failed to dismiss plan:', error)
      toast.error(TOAST_MESSAGES.PLAN_DISMISS_ERROR)
    }
  }

  if (loading) {
    return (
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Inventory Console</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InventoryTab)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value={INVENTORY_TABS.PLANS}>
              <Package className="w-4 h-4 mr-1" />
              Plans
            </TabsTrigger>
            <TabsTrigger value={INVENTORY_TABS.POS}>
              <ShoppingCart className="w-4 h-4 mr-1" />
              POs
            </TabsTrigger>
            <TabsTrigger value={INVENTORY_TABS.TRANSFERS}>
              <ArrowRightLeft className="w-4 h-4 mr-1" />
              Transfers
            </TabsTrigger>
            <TabsTrigger value={INVENTORY_TABS.ADJUSTMENTS}>
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              Adjustments
            </TabsTrigger>
            <TabsTrigger value={INVENTORY_TABS.COUNTS}>
              <ClipboardList className="w-4 h-4 mr-1" />
              Counts
            </TabsTrigger>
            <TabsTrigger value={INVENTORY_TABS.ACTIVITY}>
              <Activity className="w-4 h-4 mr-1" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value={INVENTORY_TABS.PLANS} className="mt-4">
            {plans.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No replenishment plans yet</div>
            ) : (
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div key={plan.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{plan.sku_id}</div>
                        <div className="text-xs text-gray-400">Qty: {plan.recommended_qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.priority === 'high' ? 'destructive' : plan.priority === 'medium' ? 'default' : 'secondary'}>
                          {plan.priority}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => handleDismissPlan(plan.id)}>
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value={INVENTORY_TABS.POS} className="mt-4">
            {pos.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No purchase orders yet</div>
            ) : (
              <div className="space-y-2">
                {pos.map((po) => (
                  <div key={po.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{po.number}</div>
                        <div className="text-xs text-gray-400">{po.lines?.length || 0} lines</div>
                      </div>
                      <Badge variant={po.status === 'draft' ? 'secondary' : po.status === 'confirmed' ? 'default' : 'outline'}>
                        {po.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value={INVENTORY_TABS.TRANSFERS} className="mt-4">
            {transfers.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No transfers yet</div>
            ) : (
              <div className="space-y-2">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">Transfer</div>
                        <div className="text-xs text-gray-400">{transfer.lines?.length || 0} lines</div>
                      </div>
                      <Badge variant={transfer.status === 'planned' ? 'secondary' : transfer.status === 'in_transit' ? 'default' : 'outline'}>
                        {transfer.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value={INVENTORY_TABS.ADJUSTMENTS} className="mt-4">
            {adjustments.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No adjustments yet</div>
            ) : (
              <div className="space-y-2">
                {adjustments.map((adj) => (
                  <div key={adj.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{adj.sku_id}</div>
                        <div className="text-xs text-gray-400">Delta: {adj.qty_delta > 0 ? '+' : ''}{adj.qty_delta}</div>
                      </div>
                      <Badge variant="outline">{adj.reason}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value={INVENTORY_TABS.COUNTS} className="mt-4">
            {counts.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No cycle counts yet</div>
            ) : (
              <div className="space-y-2">
                {counts.map((count) => (
                  <div key={count.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{count.scheduled_date}</div>
                        <div className="text-xs text-gray-400">{count.lines?.length || 0} SKUs</div>
                      </div>
                      <Badge variant={count.status === 'scheduled' ? 'secondary' : count.status === 'posted' ? 'default' : 'outline'}>
                        {count.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value={INVENTORY_TABS.ACTIVITY} className="mt-4">
            {auditLogs.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No activity yet</div>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="text-sm text-white">{log.action}</div>
                    <div className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

