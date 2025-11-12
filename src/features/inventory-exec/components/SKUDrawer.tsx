"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SKU_DRAWER_TABS, SKUDrawerTab, TOAST_MESSAGES, ADJUSTMENT_REASONS } from "../constants"
import { Package, Settings, History, TrendingUp, ShoppingCart, SlidersHorizontal } from "lucide-react"
import { getSKUData } from "../actions/getSKUData"
import { postAdjustment } from "../actions/postAdjustment"
import { upsertPolicyAction } from "../actions/upsertPolicy"
import type { InventorySnapshot, InventoryTransaction, Forecast, ReorderPolicy } from "../types"

export interface SKUDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skuId?: string | null
  warehouseId?: string | null
}

export function SKUDrawer({ open, onOpenChange, skuId, warehouseId }: SKUDrawerProps) {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<SKUDrawerTab>(SKU_DRAWER_TABS.SNAPSHOT)
  const [snapshot, setSnapshot] = useState<InventorySnapshot | null>(null)
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [policy, setPolicy] = useState<ReorderPolicy | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Adjustment form state
  const [qtyDelta, setQtyDelta] = useState("")
  const [reason, setReason] = useState<keyof typeof ADJUSTMENT_REASONS>(ADJUSTMENT_REASONS.OTHER)
  const [isPosting, setIsPosting] = useState(false)
  
  // Policy form state
  const [policyForm, setPolicyForm] = useState({
    method: 'minmax' as 'minmax' | 'ss-dlt' | 'periodic',
    safety_stock: '',
    reorder_point: '',
    lead_time_days: '7',
    service_level_pct: '95',
    moq: '',
    lot_multiple: '1',
  })
  const [isSavingPolicy, setIsSavingPolicy] = useState(false)

  useEffect(() => {
    if (!open || !skuId || !warehouseId || !user?.id) {
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        const data = await getSKUData(skuId, warehouseId)
        
        setSnapshot(data.snapshot)
        setTransactions(data.transactions)
        setForecasts(data.forecasts)
        setPolicy(data.policy)
        
        if (data.policy) {
          setPolicyForm({
            method: data.policy.method,
            safety_stock: data.policy.safety_stock?.toString() || '',
            reorder_point: data.policy.reorder_point?.toString() || '',
            lead_time_days: data.policy.lead_time_days.toString(),
            service_level_pct: data.policy.service_level_pct?.toString() || '95',
            moq: data.policy.moq?.toString() || '',
            lot_multiple: data.policy.lot_multiple?.toString() || '1',
          })
        }
      } catch (error) {
        console.error('[SKUDrawer] Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [open, skuId, warehouseId, user?.id])

  const handlePostAdjustment = async () => {
    if (!skuId || !warehouseId || !user?.id) {
      toast.error("Missing required data")
      return
    }

    const delta = parseInt(qtyDelta)
    if (isNaN(delta) || delta === 0) {
      toast.error("Please enter a valid quantity delta")
      return
    }

    setIsPosting(true)
    try {
      await postAdjustment({
        sku_id: skuId,
        warehouse_id: warehouseId,
        qty_delta: delta,
        reason,
        ownerUserId: user.id,
      })
      
      toast.success(TOAST_MESSAGES.ADJUSTMENT_POSTED)
      setQtyDelta("")
      
      // Refresh data
      const data = await getSKUData(skuId, warehouseId)
      setSnapshot(data.snapshot)
    } catch (error) {
      console.error('[SKUDrawer] Failed to post adjustment:', error)
      toast.error(TOAST_MESSAGES.ADJUSTMENT_ERROR)
    } finally {
      setIsPosting(false)
    }
  }

  const handleSavePolicy = async () => {
    if (!skuId || !warehouseId || !user?.id) {
      toast.error("Missing required data")
      return
    }

    setIsSavingPolicy(true)
    try {
      await upsertPolicyAction({
        sku_id: skuId,
        warehouse_id: warehouseId,
        method: policyForm.method,
        safety_stock: policyForm.safety_stock ? parseInt(policyForm.safety_stock) : undefined,
        reorder_point: policyForm.reorder_point ? parseInt(policyForm.reorder_point) : undefined,
        lead_time_days: parseInt(policyForm.lead_time_days),
        service_level_pct: parseFloat(policyForm.service_level_pct),
        moq: policyForm.moq ? parseInt(policyForm.moq) : undefined,
        lot_multiple: parseInt(policyForm.lot_multiple),
        ownerUserId: user.id,
      })
      
      toast.success(TOAST_MESSAGES.POLICY_UPDATED)
      
      // Refresh data
      const data = await getSKUData(skuId, warehouseId)
      setPolicy(data.policy)
      if (data.policy) {
        setPolicyForm({
          method: data.policy.method,
          safety_stock: data.policy.safety_stock?.toString() || '',
          reorder_point: data.policy.reorder_point?.toString() || '',
          lead_time_days: data.policy.lead_time_days.toString(),
          service_level_pct: data.policy.service_level_pct?.toString() || '95',
          moq: data.policy.moq?.toString() || '',
          lot_multiple: data.policy.lot_multiple?.toString() || '1',
        })
      }
    } catch (error) {
      console.error('[SKUDrawer] Failed to save policy:', error)
      toast.error(TOAST_MESSAGES.POLICY_ERROR)
    } finally {
      setIsSavingPolicy(false)
    }
  }

  // Show empty state if no skuId
  if (!skuId) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="text-white">Select an item to view details</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">SKU: {skuId}</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SKUDrawerTab)} className="mt-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value={SKU_DRAWER_TABS.SNAPSHOT}>
              <Package className="w-4 h-4 mr-1" />
              Snapshot
            </TabsTrigger>
            <TabsTrigger value={SKU_DRAWER_TABS.POLICY}>
              <Settings className="w-4 h-4 mr-1" />
              Policy
            </TabsTrigger>
            <TabsTrigger value={SKU_DRAWER_TABS.TRANSACTIONS}>
              <History className="w-4 h-4 mr-1" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value={SKU_DRAWER_TABS.FORECAST}>
              <TrendingUp className="w-4 h-4 mr-1" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value={SKU_DRAWER_TABS.OPEN_POS_TRANSFERS}>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Open POs/Transfers
            </TabsTrigger>
            <TabsTrigger value={SKU_DRAWER_TABS.ADJUST}>
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              Adjust
            </TabsTrigger>
          </TabsList>

          <TabsContent value={SKU_DRAWER_TABS.SNAPSHOT} className="mt-4">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : snapshot ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <div className="text-sm text-gray-400">On Hand</div>
                    <div className="text-2xl font-bold text-white">{snapshot.on_hand}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <div className="text-sm text-gray-400">Reserved</div>
                    <div className="text-2xl font-bold text-white">{snapshot.reserved}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <div className="text-sm text-gray-400">On Order</div>
                    <div className="text-2xl font-bold text-white">{snapshot.on_order}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <div className="text-sm text-gray-400">Backorder</div>
                    <div className="text-2xl font-bold text-white">{snapshot.backorder}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">No snapshot data</div>
            )}
          </TabsContent>

          <TabsContent value={SKU_DRAWER_TABS.POLICY} className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Method</label>
                  <select
                    value={policyForm.method}
                    onChange={(e) => setPolicyForm({ ...policyForm, method: e.target.value as any })}
                    className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-600"
                  >
                    <option value="minmax">Min/Max</option>
                    <option value="ss-dlt">SS-DLT</option>
                    <option value="periodic">Periodic</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Safety Stock</label>
                  <Input
                    type="number"
                    value={policyForm.safety_stock}
                    onChange={(e) => setPolicyForm({ ...policyForm, safety_stock: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Reorder Point</label>
                  <Input
                    type="number"
                    value={policyForm.reorder_point}
                    onChange={(e) => setPolicyForm({ ...policyForm, reorder_point: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Lead Time (days)</label>
                  <Input
                    type="number"
                    value={policyForm.lead_time_days}
                    onChange={(e) => setPolicyForm({ ...policyForm, lead_time_days: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Service Level %</label>
                  <Input
                    type="number"
                    value={policyForm.service_level_pct}
                    onChange={(e) => setPolicyForm({ ...policyForm, service_level_pct: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">MOQ</label>
                  <Input
                    type="number"
                    value={policyForm.moq}
                    onChange={(e) => setPolicyForm({ ...policyForm, moq: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Lot Multiple</label>
                  <Input
                    type="number"
                    value={policyForm.lot_multiple}
                    onChange={(e) => setPolicyForm({ ...policyForm, lot_multiple: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleSavePolicy} disabled={isSavingPolicy}>
                {isSavingPolicy ? 'Saving...' : 'Save Policy'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value={SKU_DRAWER_TABS.TRANSACTIONS} className="mt-4">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No transactions yet</div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{tx.type}</div>
                        <div className="text-xs text-gray-400">{new Date(tx.ts).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-white">{tx.qty > 0 ? '+' : ''}{tx.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value={SKU_DRAWER_TABS.FORECAST} className="mt-4">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : forecasts.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No forecasts yet</div>
            ) : (
              <div className="space-y-2">
                {forecasts.map((forecast) => (
                  <div key={forecast.id} className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white">{forecast.horizon_date}</div>
                      <div className="text-sm text-white">{forecast.forecast_qty}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value={SKU_DRAWER_TABS.OPEN_POS_TRANSFERS} className="mt-4">
            <div className="text-center text-gray-400 py-8">Open POs/Transfers (placeholder)</div>
          </TabsContent>

          <TabsContent value={SKU_DRAWER_TABS.ADJUST} className="mt-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Quantity Delta</label>
                <Input
                  type="number"
                  value={qtyDelta}
                  onChange={(e) => setQtyDelta(e.target.value)}
                  placeholder="Enter quantity change (+ or -)"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-600"
                >
                  {Object.entries(ADJUSTMENT_REASONS).map(([key, value]) => (
                    <option key={key} value={value}>{key}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handlePostAdjustment} disabled={isPosting || !qtyDelta}>
                {isPosting ? 'Posting...' : 'Post Adjustment'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

