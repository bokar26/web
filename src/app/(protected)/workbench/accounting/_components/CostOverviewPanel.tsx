"use client"

import { CostHeaderFilters } from "./CostHeaderFilters"
import { CostActionsBar } from "./CostActionsBar"
import { CostProjectionsProgress } from "./CostProjectionsProgress"
import { CostExceptionsBanner } from "./CostExceptionsBanner"
import { CostKpiGrid } from "./CostKpiGrid"
import { CostWorkbenchStrip } from "./CostWorkbenchStrip"
import { CostProjectionsPanel } from "./CostProjectionsPanel"
import { CostWorkbenchPanel } from "./CostWorkbenchPanel"
import { features } from "@/lib/features"
interface CostOverviewPanelProps {
  scope: {
    period: string
    category: string
    supplier: string
    confidence: string | number
  }
  onPeriodChange: (period: string) => void
  onCategoryChange: (category: string) => void
  onSupplierChange: (supplier: string) => void
  onConfidenceChange: (confidence: number) => void
  onClear: () => void
  onRecompute: () => void
  onCreateScenario: () => void
  onExport: (format: 'csv' | 'pdf') => void
  onSaveBaseline: () => void
  onEditAssumptions: () => void
  onViewExceptions: () => void
  isRunning: boolean
  runStatus: 'queued' | 'running' | 'success' | 'failed' | null
  exceptions: any[]
}

export function CostOverviewPanel({
  scope,
  onPeriodChange,
  onCategoryChange,
  onSupplierChange,
  onConfidenceChange,
  onClear,
  onRecompute,
  onCreateScenario,
  onExport,
  onSaveBaseline,
  onEditAssumptions,
  onViewExceptions,
  isRunning,
  runStatus,
  exceptions,
}: CostOverviewPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header Filters */}
      {features.costProjectionsV1 && (
        <div>
          <CostHeaderFilters
            scope={scope}
            onPeriodChange={onPeriodChange}
            onCategoryChange={onCategoryChange}
            onSupplierChange={onSupplierChange}
            onConfidenceChange={onConfidenceChange}
            onClear={onClear}
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
            onRecompute={onRecompute}
            onCreateScenario={onCreateScenario}
            onExport={onExport}
            onSaveBaseline={onSaveBaseline}
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
          <CostExceptionsBanner
            exceptions={exceptions}
            onViewExceptions={onViewExceptions}
          />
        </div>
      )}

      {/* KPI Grid */}
      {features.costProjectionsV1 && (
        <div>
          <CostKpiGrid />
        </div>
      )}

      {/* Charts */}
      {features.costProjectionsV1 && (
        <div>
          <CostProjectionsPanel />
        </div>
      )}

      {/* Workbench Content */}
      {features.costProjectionsV1 && (
        <div>
          <CostWorkbenchPanel
            scope={{
              period: scope.period,
              category: scope.category,
              supplier: scope.supplier,
              confidence: scope.confidence,
            }}
            onEditAssumptions={onEditAssumptions}
          />
        </div>
      )}
    </div>
  )
}

