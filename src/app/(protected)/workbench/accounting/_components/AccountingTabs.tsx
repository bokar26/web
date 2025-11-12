"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { CostHeaderFilters } from "./CostHeaderFilters"
import { CostActionsBar } from "./CostActionsBar"
import { CostExceptionsBanner } from "./CostExceptionsBanner"
import { CostKpiGrid } from "./CostKpiGrid"
import { CostWorkbenchStrip } from "./CostWorkbenchStrip"
import { FinancesPanel } from "./FinancesPanel"
import { CostProjectionsHeader } from "./CostProjectionsHeader"
import { CostProjectionsActions } from "./CostProjectionsActions"
import { CostProjectionsProgress } from "./CostProjectionsProgress"
import { CostProjectionsExceptions } from "./CostProjectionsExceptions"
import { CostProjectionsKpis } from "./CostProjectionsKpis"
import { CostProjectionsWorkbench } from "./CostProjectionsWorkbench"
import { CostWorkbenchPanel } from "./CostWorkbenchPanel"
import { CostProjectionsPanel } from "./CostProjectionsPanel"
import { CostBreakdownPanel } from "./CostBreakdownPanel"
import { SupplierCostsPanel } from "./SupplierCostsPanel"
import { CostDriversPanel } from "./CostDriversPanel"
import { CostEstimatorPanel } from "./CostEstimatorPanel"
import { useCostProjectionScope } from "@/features/cost-projections/hooks/useCostProjectionScope"
import { recomputeProjections } from "@/features/cost-projections/actions/recomputeProjections"
import { getRunStatus } from "@/features/cost-projections/actions/getRunStatus"
import { exportProjections } from "@/features/cost-projections/actions/exportProjections"
import { listExceptions } from "@/features/cost-projections/actions/listExceptions"
import { features } from "@/lib/features"
import { cn } from "@/lib/utils"
import { costEstimatorInputs, costBreakdown as mockCostBreakdown } from "@/lib/mockData"

const TABS = [
  { id: 'costs', label: 'Costs' },
  { id: 'finances', label: 'Finances' },
  { id: 'workbench', label: 'Workbench' },
  { id: 'cost-projections', label: 'Cost Projections' },
  { id: 'cost-breakdown', label: 'Cost Breakdown' },
  { id: 'supplier-costs', label: 'Supplier Costs' },
  { id: 'cost-drivers', label: 'Cost Drivers' },
  { id: 'cost-estimator', label: 'Cost Estimator' },
] as const

type TabId = typeof TABS[number]['id']

// Valid tab IDs for validation (constant outside component)
const VALID_TAB_IDS: TabId[] = ['costs', 'finances', 'workbench', 'cost-projections', 'cost-breakdown', 'supplier-costs', 'cost-drivers', 'cost-estimator']

export function AccountingTabs() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { scope, setPeriod, setCategory, setSupplier, setConfidence, setRunId } = useCostProjectionScope()
  const [isRunning, setIsRunning] = useState(false)
  const [runStatus, setRunStatus] = useState<'queued' | 'running' | 'success' | 'failed' | null>(null)
  const [exceptions, setExceptions] = useState<any[]>([])
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  
  // Cost Estimator state
  const [inputs, setInputs] = useState(costEstimatorInputs)
  const [breakdown, setBreakdown] = useState(mockCostBreakdown)
  
  // Mock data for supplier costs and cost drivers
  const supplierCosts = [
    { supplier: 'Supplier A', category: 'Raw Materials', items: 'Item A, Item B', currentRate: 120000, quoteStatus: 'pending' as const },
    { supplier: 'Supplier B', category: 'Labor', items: 'Item C', currentRate: 95000, quoteStatus: 'applied' as const },
    { supplier: 'Supplier C', category: 'Transportation', items: 'Item D, Item E', currentRate: 85000, quoteStatus: 'expired' as const },
    { supplier: 'Supplier D', category: 'Raw Materials', items: 'Item F', currentRate: 75000, quoteStatus: 'none' as const },
    { supplier: 'Supplier E', category: 'Packaging', items: 'Item G', currentRate: 65000, quoteStatus: 'none' as const },
  ]
  
  const costDrivers = [
    { driver: 'Material Price Inflation', impact: 15.2, confidence: 85 },
    { driver: 'Labor Cost Increase', impact: 8.7, confidence: 92 },
    { driver: 'Fuel Price Volatility', impact: 12.3, confidence: 78 },
    { driver: 'Currency Exchange Rate', impact: 6.8, confidence: 65 },
    { driver: 'Regulatory Changes', impact: 4.1, confidence: 45 },
  ]
  
  // Get active tab from URL param, default to "costs" (SSR-safe)
  const tabParam = searchParams.get('tab')
  const initialTab: TabId = VALID_TAB_IDS.includes(tabParam as TabId) ? (tabParam as TabId) : 'costs'
  
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  
  // Sync with hash changes and initial hash on mount (client-only)
  useEffect(() => {
    const syncFromHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.slice(1)
        if (VALID_TAB_IDS.includes(hash as TabId)) {
          setActiveTab(hash as TabId)
        }
      }
    }
    
    // Check initial hash
    syncFromHash()
    
    // Listen for hash changes
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])
  
  const handleTabChange = (value: TabId) => {
    setActiveTab(value)
    
    // Update hash
    if (typeof window !== 'undefined') {
      window.location.hash = value
    }
    
    // Also update URL params for backward compatibility
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'costs') {
      params.delete('tab')
    } else {
      params.set('tab', value)
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.replace(newUrl, { scroll: false })
  }
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, tabId: TabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleTabChange(tabId)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const currentIndex = TABS.findIndex(t => t.id === activeTab)
      const direction = e.key === 'ArrowLeft' ? -1 : 1
      const newIndex = (currentIndex + direction + TABS.length) % TABS.length
      const newTab = TABS[newIndex].id
      handleTabChange(newTab)
      tabRefs.current[newTab]?.focus()
    }
  }

  // Load exceptions on mount
  useEffect(() => {
    if (features.costProjectionsV1) {
      loadExceptions()
    }
  }, [])

  // Poll run status if running
  useEffect(() => {
    if (scope.runId && (runStatus === 'queued' || runStatus === 'running')) {
      const interval = setInterval(async () => {
        try {
          const result = await getRunStatus({ runId: scope.runId! })
          if (result.ok && result.status) {
            setRunStatus(result.status)
            if (result.status === 'success' || result.status === 'failed') {
              clearInterval(interval)
              setPollingInterval(null)
              setIsRunning(false)
              if (result.status === 'success') {
                toast.success("Projections recomputed successfully")
              } else {
                toast.error("Projection recomputation failed")
              }
            }
          }
        } catch (error: any) {
          console.error("Failed to poll run status:", error)
        }
      }, 3000)
      setPollingInterval(interval)
      return () => {
        clearInterval(interval)
      }
    } else if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }, [scope.runId, runStatus])

  const loadExceptions = async () => {
    try {
      const result = await listExceptions()
      if (result.ok && result.exceptions) {
        setExceptions(result.exceptions)
      } else {
        setExceptions([])
      }
    } catch (error) {
      console.error("[Accounting] Failed to load exceptions:", error)
      setExceptions([])
    }
  }

  const handleRecompute = async () => {
    if (!user?.id) {
      toast.error("Please sign in to recompute projections")
      return
    }

    setIsRunning(true)
    setRunStatus('queued')
    try {
      const result = await recomputeProjections({
        period: scope.period,
        category: scope.category,
        supplier: scope.supplier,
        confidence: scope.confidence,
        ownerUserId: user.id,
      })
      if (result.ok && result.runId) {
        setRunId(result.runId)
        setRunStatus('queued')
        toast.success("Projection recomputation queued")
      } else {
        toast.error(result.error || "Failed to recompute projections")
        setIsRunning(false)
        setRunStatus(null)
      }
    } catch (error: any) {
      console.error('[Accounting] handleRecompute error:', error)
      toast.error(error.message || "Failed to recompute projections")
      setIsRunning(false)
      setRunStatus(null)
    }
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (format === 'pdf') {
      toast.info("PDF export coming soon")
      return
    }

    try {
      const result = await exportProjections({
        scope: {
          period: scope.period,
          category: scope.category,
          supplier: scope.supplier,
          confidence: scope.confidence,
        },
        format: 'csv',
      })
      if (result.ok && result.url) {
        const link = document.createElement('a')
        link.href = result.url
        link.download = `cost-projections-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => {
          if (result.url?.startsWith('blob:')) {
            URL.revokeObjectURL(result.url)
          }
        }, 100)
        toast.success("CSV export generated")
      } else {
        toast.error(result.error || "Failed to export projections")
      }
    } catch (error: any) {
      console.error('[Accounting] handleExport error:', error)
      toast.error(error.message || "Failed to export projections")
    }
  }

  const handleCreateScenario = () => {
    toast.info("Create scenario feature coming soon")
  }

  const handleSaveBaseline = () => {
    toast.info("Save baseline feature coming soon")
  }

  const handleEditAssumptions = () => {
    loadExceptions()
  }

  const handleViewExceptions = () => {
    toast.info("View exceptions")
  }

  const handleClearFilters = () => {
    setPeriod("12")
    setCategory("all")
    setSupplier("all")
    setConfidence(85)
  }

  // Cost Estimator handlers
  const handleInputChange = (field: string, value: any) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
    // Simulate cost recalculation
    const quantityMultiplier = field === 'quantity' ? (value / inputs.quantity) : 1
    const newBreakdown = {
      product: Math.round(breakdown.product * quantityMultiplier),
      freight: Math.round(breakdown.freight * quantityMultiplier),
      duty: newInputs.dutyEnabled ? Math.round(breakdown.duty * quantityMultiplier) : 0,
      misc: Math.round(breakdown.misc * quantityMultiplier),
      total: 0
    }
    newBreakdown.total = newBreakdown.product + newBreakdown.freight + newBreakdown.duty + newBreakdown.misc
    setBreakdown(newBreakdown)
  }

  const handleApplyQuote = () => {
    toast.info("Apply quote feature coming soon")
  }

  return (
    <div className="space-y-6">
      {/* Custom Tab List */}
      <div
        role="tablist"
        className="flex items-center gap-2 p-1 bg-background rounded-lg"
        aria-label="Accounting tabs"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <div key={tab.id} className="relative">
              <button
                ref={(el) => {
                  tabRefs.current[tab.id] = el
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                className={cn(
                  "inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 hover:ring-1 hover:ring-emerald-400/50"
                )}
              >
                {tab.label}
              </button>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" style={{ bottom: '-2px' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div
        id="tabpanel-costs"
        role="tabpanel"
        aria-labelledby="tab-costs"
        hidden={activeTab !== 'costs'}
        className={cn("space-y-6", activeTab !== 'costs' && "hidden")}
      >
        {/* Filters */}
        {features.costProjectionsV1 && (
          <div>
            <CostHeaderFilters
              scope={scope}
              onPeriodChange={setPeriod}
              onCategoryChange={setCategory}
              onSupplierChange={setSupplier}
              onConfidenceChange={setConfidence}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Action Bar */}
        {features.costProjectionsV1 && (
          <div>
            <CostActionsBar
              scope={{
                period: scope.period,
                category: scope.category,
                supplier: scope.supplier,
                confidence: scope.confidence,
              }}
              onRecompute={handleRecompute}
              onCreateScenario={handleCreateScenario}
              onExport={handleExport}
              onSaveBaseline={handleSaveBaseline}
              isRunning={isRunning}
              status={runStatus === 'queued' || runStatus === 'running' ? 'Running...' : undefined}
            />
          </div>
        )}

        {/* Exceptions Banner */}
        {features.costProjectionsV1 && (
          <div>
            <CostExceptionsBanner
              exceptions={exceptions}
              onViewExceptions={handleViewExceptions}
            />
          </div>
        )}

        {/* KPI Grid */}
        {features.costProjectionsV1 && (
          <div>
            <CostKpiGrid />
          </div>
        )}

        {/* Workbench Strip */}
        {features.costProjectionsV1 && (
          <div>
            <CostWorkbenchStrip
              scope={{
                period: scope.period,
                category: scope.category,
                supplier: scope.supplier,
                confidence: scope.confidence,
              }}
              onEditAssumptions={handleEditAssumptions}
            />
          </div>
        )}
      </div>

      <div
        id="tabpanel-finances"
        role="tabpanel"
        aria-labelledby="tab-finances"
        hidden={activeTab !== 'finances'}
        className={cn("space-y-6", activeTab !== 'finances' && "hidden")}
      >
        <FinancesPanel />
      </div>

      <div
        id="tabpanel-cost-projections"
        role="tabpanel"
        aria-labelledby="tab-cost-projections"
        hidden={activeTab !== 'cost-projections'}
        className={cn("space-y-6", activeTab !== 'cost-projections' && "hidden")}
      >
        {/* Header Filters */}
        {features.costProjectionsV1 && (
          <div>
            <CostProjectionsHeader
              scope={scope}
              onPeriodChange={setPeriod}
              onCategoryChange={setCategory}
              onSupplierChange={setSupplier}
              onConfidenceChange={setConfidence}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Actions */}
        {features.costProjectionsV1 && (
          <div>
            <CostProjectionsActions
              scope={{
                period: scope.period,
                category: scope.category,
                supplier: scope.supplier,
                confidence: scope.confidence,
              }}
              onRecompute={handleRecompute}
              onCreateScenario={handleCreateScenario}
              onExport={handleExport}
              onSaveBaseline={handleSaveBaseline}
              isRunning={isRunning}
              status={runStatus === 'queued' || runStatus === 'running' ? 'Running...' : undefined}
            />
          </div>
        )}

        {/* Progress Banner */}
        {features.costProjectionsV1 && (
          <div>
            <CostProjectionsProgress
              runStatus={runStatus}
              isRunning={isRunning}
            />
          </div>
        )}

        {/* Exceptions Banner */}
        {features.costProjectionsV1 && (
          <div>
            <CostProjectionsExceptions
              exceptions={exceptions}
              onViewExceptions={handleViewExceptions}
            />
          </div>
        )}

        {/* KPI Grid */}
        {features.costProjectionsV1 && (
          <div>
            <CostProjectionsKpis />
          </div>
        )}

        {/* Charts */}
        {features.costProjectionsV1 && (
          <div>
            <CostProjectionsPanel />
          </div>
        )}
      </div>

      <div
        id="tabpanel-workbench"
        role="tabpanel"
        aria-labelledby="tab-workbench"
        hidden={activeTab !== 'workbench'}
        className={cn("space-y-6", activeTab !== 'workbench' && "hidden")}
      >
        {features.costProjectionsV1 && (
          <CostWorkbenchPanel
            scope={{
              period: scope.period,
              category: scope.category,
              supplier: scope.supplier,
              confidence: scope.confidence,
            }}
            onEditAssumptions={handleEditAssumptions}
          />
        )}
      </div>

      <div
        id="tabpanel-cost-breakdown"
        role="tabpanel"
        aria-labelledby="tab-cost-breakdown"
        hidden={activeTab !== 'cost-breakdown'}
        className={cn("space-y-6", activeTab !== 'cost-breakdown' && "hidden")}
      >
        <CostBreakdownPanel />
      </div>

      <div
        id="tabpanel-supplier-costs"
        role="tabpanel"
        aria-labelledby="tab-supplier-costs"
        hidden={activeTab !== 'supplier-costs'}
        className={cn("space-y-6", activeTab !== 'supplier-costs' && "hidden")}
      >
        <SupplierCostsPanel
          supplierCosts={supplierCosts}
          onApplyQuote={handleApplyQuote}
        />
      </div>

      <div
        id="tabpanel-cost-drivers"
        role="tabpanel"
        aria-labelledby="tab-cost-drivers"
        hidden={activeTab !== 'cost-drivers'}
        className={cn("space-y-6", activeTab !== 'cost-drivers' && "hidden")}
      >
        <CostDriversPanel costDrivers={costDrivers} />
      </div>

      <div
        id="tabpanel-cost-estimator"
        role="tabpanel"
        aria-labelledby="tab-cost-estimator"
        hidden={activeTab !== 'cost-estimator'}
        className={cn("space-y-6", activeTab !== 'cost-estimator' && "hidden")}
      >
        {features.costProjectionsV1 && (
          <CostEstimatorPanel
            inputs={inputs}
            breakdown={breakdown}
            onInputChange={handleInputChange}
          />
        )}
      </div>
    </div>
  )
}

