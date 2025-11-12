"use client";

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { inventoryPlans, demandForecastData } from "@/lib/mockData";
import { Package, AlertTriangle, TrendingUp, Calendar, BarChart3, ShoppingCart, RefreshCw, Download, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { features } from "@/lib/features"
import { ActionBar } from "@/components/dashboard/ActionBar";
import { SummaryHeader } from "@/components/dashboard/SummaryHeader";
import { FloatingActionBar } from "@/components/dashboard/FloatingActionBar";
import { InventoryConsole } from "@/features/inventory-exec/components/InventoryConsole"
import { SKUDrawer } from "@/features/inventory-exec/components/SKUDrawer"
import { POModal } from "@/features/inventory-exec/components/POModal"
import { TransferModal } from "@/features/inventory-exec/components/TransferModal"
import { generateReplenishmentPlans } from "@/features/inventory-exec/actions/generateReplenishmentPlans"
import { createPOAction } from "@/features/inventory-exec/actions/createPO"
import { createTransferAction } from "@/features/inventory-exec/actions/createTransfer"
import { dismissPlan } from "@/features/inventory-exec/actions/dismissPlan"
import { TOAST_MESSAGES } from "@/features/inventory-exec/constants"

export default function InventoryPlansPage() {
  const { user } = useUser()
  const [showInventoryConsole, setShowInventoryConsole] = useState(false)
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null)
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null)
  const [isSkuDrawerOpen, setIsSkuDrawerOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPOModalOpen, setIsPOModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedPlanForPO, setSelectedPlanForPO] = useState<any>(null)
  const [selectedPlanForTransfer, setSelectedPlanForTransfer] = useState<any>(null)
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'medium':
        return 'text-amber-400 bg-amber-900/20 border-amber-500/30';
      case 'low':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      default:
        return 'text-gray-600 dark:text-white bg-gray-900/20 border-gray-500/30';
    }
  };

  const handleGeneratePlans = async () => {
    if (!user?.id) {
      toast.error("Please sign in")
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateReplenishmentPlans({
        horizonDays: 30,
        ownerUserId: user.id,
      })
      
      toast.success(TOAST_MESSAGES.PLANS_GENERATED(result.count))
      // Refresh console if open
      if (showInventoryConsole) {
        setShowInventoryConsole(false)
        setTimeout(() => setShowInventoryConsole(true), 100)
      }
    } catch (error) {
      console.error('[InventoryPlansPage] Failed to generate plans:', error)
      toast.error(TOAST_MESSAGES.PLANS_ERROR)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOpenSKUDrawer = (sku: string, location?: string) => {
    setSelectedSkuId(sku)
    setSelectedWarehouseId(location || null)
    setIsSkuDrawerOpen(true)
  }

  const closeSkuDrawer = () => {
    setIsSkuDrawerOpen(false)
    setSelectedSkuId(null)
    setSelectedWarehouseId(null)
  }

  const handleGeneratePO = (plan: any) => {
    setSelectedPlanForPO(plan)
    setIsPOModalOpen(true)
  }

  const handleCreateTransfer = (plan: any) => {
    setSelectedPlanForTransfer(plan)
    setIsTransferModalOpen(true)
  }

  const handleDismissPlan = async (planId: string) => {
    if (!user?.id) {
      toast.error("Please sign in")
      return
    }

    try {
      await dismissPlan({ planId, ownerUserId: user.id })
      toast.success(TOAST_MESSAGES.PLAN_DISMISSED)
    } catch (error) {
      console.error('[InventoryPlansPage] Failed to dismiss plan:', error)
      toast.error(TOAST_MESSAGES.PLAN_DISMISS_ERROR)
    }
  }

  // Calculate summary metrics
  const calculateSKUsBelowSafetyStock = () => {
    return inventoryPlans.filter(plan => plan.riskLevel === 'high' || plan.riskLevel === 'medium').length;
  };

  const calculatePotentialSavings = () => {
    // Placeholder calculation - sum of savings from plans
    return inventoryPlans.reduce((sum, plan) => sum + (plan.savings || 0), 0);
  };

  const handleGenerateAllPOs = () => {
    const plansNeedingPO = inventoryPlans.filter(plan => plan.riskLevel === 'high' || plan.riskLevel === 'medium');
    if (plansNeedingPO.length === 0) {
      toast.info("No plans require purchase orders");
      return;
    }
    // Open PO modal for first plan, or show selection
    if (plansNeedingPO.length > 0) {
      handleGeneratePO(plansNeedingPO[0]);
    }
  };

  const handleCreateAllTransfers = () => {
    const plansNeedingTransfer = inventoryPlans.filter(plan => plan.riskLevel === 'low');
    if (plansNeedingTransfer.length === 0) {
      toast.info("No plans require transfers");
      return;
    }
    // Open Transfer modal for first plan
    if (plansNeedingTransfer.length > 0) {
      handleCreateTransfer(plansNeedingTransfer[0]);
    }
  };

  const handleRecalculateForecast = () => {
    toast.info("Recalculate demand forecast feature coming soon");
  };

  const handleSyncSafetyStock = () => {
    toast.info("Sync safety stock feature coming soon");
  };

  const handleExportSnapshot = () => {
    toast.info("Export inventory snapshot feature coming soon");
  };

  const handleExportSummary = () => {
    toast.info("Export summary feature coming soon");
  };

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        {/* Header row with actions */}
        {features.inventoryExec && (
          <div className="flex items-center justify-between gap-3 pt-2 md:pt-3">
            <div></div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="outline"
                onClick={() => setShowInventoryConsole(!showInventoryConsole)}
                className="h-10"
              >
                {showInventoryConsole ? 'Hide' : 'Show'} Console
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white h-10"
                onClick={handleGeneratePlans}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Plans'}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Charts */}
          <div className="space-y-6">
          {/* Demand Forecast Chart */}
          <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Demand Forecast vs Actual</span>
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-white">Forecast</span>
                <div className="w-3 h-3 rounded-full bg-green-500 ml-4"></div>
                <span className="text-gray-600 dark:text-white">Actual</span>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

          {/* Safety Stock Coverage */}
          <Card className="dashboard-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Safety Stock Coverage</span>
            </h3>
            
            <div className="space-y-4">
              {inventoryPlans.map((plan) => (
                <div
                  key={plan.sku}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => features.inventoryExec && handleOpenSKUDrawer(plan.sku, plan.location)}
                >
                  <div className="flex items-center space-x-3">
                    <Package className="w-4 h-4 text-gray-600 dark:text-white" />
                    <div>
                      <div className="text-sm font-medium text-white">{plan.sku}</div>
                      <div className="text-xs text-gray-600 dark:text-white">{plan.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{plan.safetyStockDays} days</div>
                    <div className={`text-xs px-2 py-1 rounded ${getRiskColor(plan.riskLevel)}`}>
                      {plan.riskLevel.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Right Column - Actionable List */}
        <div className="space-y-6">
          {/* Reorder Recommendations */}
          <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Reorder Recommendations</h3>
              {features.inventoryExec ? (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleGeneratePlans}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Plans'}
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Generate Orders
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {inventoryPlans.map((plan) => (
                <div
                  key={plan.sku}
                  className="p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                  onClick={() => features.inventoryExec && handleOpenSKUDrawer(plan.sku, plan.location)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-600 dark:text-white" />
                      <span className="text-sm font-medium text-white">{plan.sku}</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${getRiskColor(plan.riskLevel)}`}>
                      {plan.riskLevel.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-gray-600 dark:text-white mb-1">Current Stock</div>
                      <div className="text-white font-medium">{plan.currentQty} units</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-white mb-1">Forecasted Demand</div>
                      <div className="text-white font-medium">{plan.forecastedDemand} units</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-white" />
                      <span className="text-gray-600 dark:text-white">Reorder Date:</span>
                      <span className="text-white">{plan.reorderDate}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 dark:text-white">Qty to Reorder</div>
                      <div className="text-lg font-bold text-green-400">{plan.reorderQty}</div>
                    </div>
                  </div>

                  {features.inventoryExec && (
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGeneratePO(plan)}
                        className="hover:bg-gray-700 transition-colors"
                        title="Generate purchase order for this SKU"
                      >
                        Generate PO
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateTransfer(plan)}
                        className="hover:bg-gray-700 transition-colors"
                        title="Create transfer for this SKU"
                      >
                        Create Transfer
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismissPlan(plan.sku)}
                        className="hover:bg-gray-700 transition-colors"
                        title="Dismiss this recommendation"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          {/* Working Capital Impact */}
          <Card className="dashboard-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Working Capital Impact</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-400">Potential Savings</span>
                  <AlertTriangle className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400">$125,000</div>
                <div className="text-xs text-gray-600 dark:text-white">Through optimized inventory levels</div>
              </div>

              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-400">Stock-out Risk</span>
                  <AlertTriangle className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">3.2%</div>
                <div className="text-xs text-gray-600 dark:text-white">Current risk level</div>
              </div>

              <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-400">Overstock Risk</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400">8.7%</div>
                <div className="text-xs text-gray-600 dark:text-white">Current risk level</div>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>

        {/* Inventory Console */}
        {features.inventoryExec && showInventoryConsole && (
          <div className="mt-6">
            <InventoryConsole onClose={() => setShowInventoryConsole(false)} />
          </div>
        )}

      {/* SKU Drawer */}
      {features.inventoryExec && (
        <SKUDrawer
          open={isSkuDrawerOpen}
          onOpenChange={(v) => v ? setIsSkuDrawerOpen(true) : closeSkuDrawer()}
          skuId={selectedSkuId}
          warehouseId={selectedWarehouseId}
        />
      )}

      {/* Floating Action Bar */}
      {features.inventoryExec && (
        <FloatingActionBar
          actions={[
            {
              label: 'Generate All POs',
              onClick: handleGenerateAllPOs,
              icon: <ShoppingCart className="w-4 h-4" />,
              tooltip: 'Generate purchase orders for all plans needing reorder',
            },
            {
              label: 'Create All Transfers',
              onClick: handleCreateAllTransfers,
              icon: <Package className="w-4 h-4" />,
              tooltip: 'Create transfers for all plans',
            },
            {
              label: 'Export Summary',
              onClick: handleExportSummary,
              icon: <Download className="w-4 h-4" />,
              tooltip: 'Export inventory plans summary',
            },
          ]}
          position="bottom-right"
        />
      )}

      {/* PO Modal */}
      {features.inventoryExec && (
        <POModal
          isOpen={isPOModalOpen}
          onClose={() => {
            setIsPOModalOpen(false)
            setSelectedPlanForPO(null)
          }}
          initialLines={selectedPlanForPO ? [{
            sku_id: selectedPlanForPO.sku,
            qty: selectedPlanForPO.reorderQty,
            price: 0,
            warehouse_id: selectedPlanForPO.location || '',
            promised_date: '',
          }] : undefined}
        />
      )}

      {/* Transfer Modal */}
      {features.inventoryExec && (
        <TransferModal
          isOpen={isTransferModalOpen}
          onClose={() => {
            setIsTransferModalOpen(false)
            setSelectedPlanForTransfer(null)
          }}
          initialLines={selectedPlanForTransfer ? [{
            sku_id: selectedPlanForTransfer.sku,
            qty: selectedPlanForTransfer.reorderQty,
          }] : undefined}
          toWarehouseId={selectedPlanForTransfer?.location || undefined}
        />
      )}
      </div>
    </div>
  );
}
