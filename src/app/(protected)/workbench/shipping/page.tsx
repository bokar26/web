"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShipmentsBoard } from "./_components/ShipmentsBoard"
import { RateQuotePanel } from "./_components/RateQuotePanel"
import { BookShipmentDrawer } from "./_components/BookShipmentDrawer"
import { DocumentsPanel } from "./_components/DocumentsPanel"
import { ShippingKPIs } from "@/features/shipping-plans-exec/components/ShippingKPIs"
import { ShippingMiniStats } from "./_components/ShippingMiniStats"
import { ShippingActionsBar } from "./_components/ShippingActionsBar"
import { Section } from "../_components/Section"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { features } from "@/lib/features"
import { applyPlan } from "@/features/shipping-plans-exec/actions/applyPlan"
import { createRFQ } from "@/features/shipping-plans-exec/actions/createRFQ"
import { listShipments } from "@/features/shipping-plans-exec/data/shipments"
import { getShipmentKPIs } from "@/features/shipping-plans-exec/actions/getKPIs"
import { shippingPlans } from "@/lib/mockData"

export default function ShippingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>()
  const [isApplying, setIsApplying] = useState(false)
  const [isCreatingRFQ, setIsCreatingRFQ] = useState(false)
  const [kpiData, setKpiData] = useState({ totalShipments: 0, totalPlannedCost: 0 })
  const [appliedShipmentIds, setAppliedShipmentIds] = useState<Map<string, string>>(new Map())
  const [showExecutionConsole, setShowExecutionConsole] = useState(false)

  // Load KPIs
  useEffect(() => {
    const loadKPIs = async () => {
      if (!user?.id || !features.shippingPlansExec) return
      try {
        const data = await getShipmentKPIs()
        setKpiData({ totalShipments: data.totalShipments, totalPlannedCost: data.totalPlannedCost })
      } catch (error) {
        console.error('[workbench/shipping] Failed to load KPIs:', error)
      }
    }
    loadKPIs()

    // Listen for refresh events
    const handleRefresh = () => loadKPIs()
    window.addEventListener('shipping-kpis-refresh', handleRefresh)
    return () => window.removeEventListener('shipping-kpis-refresh', handleRefresh)
  }, [user?.id])

  // Calculate cost saved from mock plans (in production, this would come from actual data)
  const calculateCostSaved = () => {
    return shippingPlans.reduce((sum, plan) => sum + plan.savings, 0)
  }

  const handleShipmentClick = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId)
    setDrawerOpen(true)
  }

  const handleBook = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId)
    setDrawerOpen(true)
  }

  const handleSimulateAllRoutes = () => {
    toast.info("Simulating all routes...")
  }

  const handleApplyRecommendedPlan = async () => {
    if (!user?.id) {
      toast.error("Please sign in to apply plans")
      return
    }
    if (shippingPlans.length === 0) return

    setIsApplying(true)
    const toastId = toast.loading("Applying plan...")

    try {
      const planPayloads = [shippingPlans[0]].map((plan) => ({
        planId: String(plan.id),
        origin: plan.origin,
        destination: plan.destination,
        carrier: plan.carrier,
        recommendedETA: plan.recommendedETA,
        recommendedCost: plan.recommendedCost,
        recommendedRoute: plan.recommendedRoute,
      }))

      const result = await applyPlan({
        plans: planPayloads,
        ownerUserId: user.id,
      })

      const count = result.shipments.length
      toast.success(`✅ ${count} route${count !== 1 ? 's' : ''} optimized successfully`, { id: toastId })

      const newMap = new Map(appliedShipmentIds)
      result.shipments.forEach((s) => {
        newMap.set(s.planId, s.id)
      })
      setAppliedShipmentIds(newMap)
      window.dispatchEvent(new Event('shipping-kpis-refresh'))
    } catch (error) {
      console.error('[workbench/shipping] Failed to apply plan:', error)
      toast.error(error instanceof Error ? error.message : "Failed to apply plan", { id: toastId })
    } finally {
      setIsApplying(false)
    }
  }

  const handleApplyAllPlans = async () => {
    if (!user?.id) {
      toast.error("Please sign in to apply plans")
      return
    }

    setIsApplying(true)
    const toastId = toast.loading("Applying plans...")

    try {
      const planPayloads = shippingPlans.map((plan) => ({
        planId: String(plan.id),
        origin: plan.origin,
        destination: plan.destination,
        carrier: plan.carrier,
        recommendedETA: plan.recommendedETA,
        recommendedCost: plan.recommendedCost,
        recommendedRoute: plan.recommendedRoute,
      }))

      const result = await applyPlan({
        plans: planPayloads,
        ownerUserId: user.id,
      })

      const count = result.shipments.length
      toast.success(`✅ ${count} route${count !== 1 ? 's' : ''} optimized successfully`, { id: toastId })

      const newMap = new Map(appliedShipmentIds)
      result.shipments.forEach((s) => {
        newMap.set(s.planId, s.id)
      })
      setAppliedShipmentIds(newMap)
      window.dispatchEvent(new Event('shipping-kpis-refresh'))
    } catch (error) {
      console.error('[workbench/shipping] Failed to apply plans:', error)
      toast.error(error instanceof Error ? error.message : "Failed to apply plans", { id: toastId })
    } finally {
      setIsApplying(false)
    }
  }

  const handleCreateRFQForAll = async () => {
    if (!user?.id) {
      toast.error("Please sign in to create RFQ")
      return
    }

    const appliedShipmentIdsList = Array.from(appliedShipmentIds.values())
    if (appliedShipmentIdsList.length === 0) {
      toast.error("Please apply plans first to create RFQs")
      return
    }

    setIsCreatingRFQ(true)
    const toastId = toast.loading("Creating RFQs...")

    try {
      const { createBrowserClient } = await import('@/lib/supabase/client')
      const supabase = createBrowserClient()
      const { data: providersResult } = await supabase
        .from('freight_forwarders')
        .select('id')
        .eq('ff_type', 'Freight Forwarder')
        .limit(10)

      const providerIds = (providersResult || []).slice(0, 3).map((p: any) => p.id)

      if (providerIds.length === 0) {
        toast.error("No providers available", { id: toastId })
        return
      }

      const result = await createRFQ({
        shipmentIds: appliedShipmentIdsList,
        providerIds,
        ownerUserId: user.id,
      })

      toast.success(`RFQ created for ${result.quotes.length} provider(s)`, { id: toastId })
      window.dispatchEvent(new Event('shipping-kpis-refresh'))
    } catch (error) {
      console.error("[workbench/shipping] Failed to create RFQ:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create RFQ", { id: toastId })
    } finally {
      setIsCreatingRFQ(false)
    }
  }

  const handleExportReport = () => {
    toast.info("Export feature coming soon")
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
            {/* Header row with actions */}
            <div className="flex items-center justify-between gap-3 pt-2 md:pt-3">
              <div></div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white h-10"
                  onClick={() => {
                    setSelectedShipmentId(undefined)
                    setDrawerOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Shipment
                </Button>
              </div>
            </div>

            {/* Shipping KPIs */}
            {features.shippingPlansExec && (
              <div>
                <ShippingKPIs />
              </div>
            )}

          {/* Mini Stats */}
          {features.shippingPlansExec && (
            <div>
              <ShippingMiniStats
                totalShipments={kpiData.totalShipments}
                costSaved={calculateCostSaved()}
                routesOptimized={appliedShipmentIds.size}
                onViewDetails={() => setShowExecutionConsole(true)}
              />
            </div>
          )}

          {/* Action Bar */}
          {features.shippingPlansExec && (
            <div>
              <ShippingActionsBar
                onSimulateAllRoutes={handleSimulateAllRoutes}
                onApplyRecommendedPlan={handleApplyRecommendedPlan}
                onApplyAllPlans={handleApplyAllPlans}
                onCreateRFQ={handleCreateRFQForAll}
                onExportReport={handleExportReport}
                isApplying={isApplying}
                isCreatingRFQ={isCreatingRFQ}
                appliedShipmentCount={appliedShipmentIds.size}
                hasPlans={shippingPlans.length > 0}
              />
            </div>
          )}

            {/* Shipments Board */}
            <Section title="Shipments" subtitle="Track and manage shipments">
              <ShipmentsBoard
                onShipmentClick={handleShipmentClick}
                onBook={handleBook}
              />
            </Section>

            {/* Rate Quotes */}
            <Section title="Rate Quotes" subtitle="Manage rate quotes and freight forwarder selection">
              <RateQuotePanel />
            </Section>

            {/* Documents */}
            <Section title="Documents" subtitle="Attach and manage shipment documents">
              <DocumentsPanel />
            </Section>
          </div>
        </div>
      </div>

      {/* Book Shipment Drawer */}
      <BookShipmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        shipmentId={selectedShipmentId}
      />
    </div>
  )
}
