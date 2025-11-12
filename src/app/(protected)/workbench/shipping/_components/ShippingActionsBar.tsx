"use client"

import { ActionBar, type ActionBarAction } from "@/components/dashboard/ActionBar"
import { Play, Zap, CheckCircle, FileText, Download } from "lucide-react"

interface ShippingActionsBarProps {
  onSimulateAllRoutes: () => void
  onApplyRecommendedPlan: () => void
  onApplyAllPlans: () => void
  onCreateRFQ: () => void
  onExportReport: () => void
  isApplying?: boolean
  isCreatingRFQ?: boolean
  appliedShipmentCount?: number
  hasPlans?: boolean
}

export function ShippingActionsBar({
  onSimulateAllRoutes,
  onApplyRecommendedPlan,
  onApplyAllPlans,
  onCreateRFQ,
  onExportReport,
  isApplying = false,
  isCreatingRFQ = false,
  appliedShipmentCount = 0,
  hasPlans = true,
}: ShippingActionsBarProps) {
  const actions: ActionBarAction[] = [
    {
      label: 'Simulate All Routes',
      onClick: onSimulateAllRoutes,
      variant: 'outline',
      tooltip: 'Run simulation for all current and recommended shipping routes',
      icon: <Play className="w-4 h-4" />,
    },
    {
      label: 'Apply Recommended Plan',
      onClick: onApplyRecommendedPlan,
      variant: 'default',
      tooltip: 'Apply the top recommended route optimization',
      icon: <Zap className="w-4 h-4" />,
      disabled: isApplying || !hasPlans,
    },
    {
      label: 'Apply All Plans',
      onClick: onApplyAllPlans,
      variant: 'default',
      tooltip: 'Apply all recommended route optimizations',
      icon: <CheckCircle className="w-4 h-4" />,
      disabled: isApplying,
    },
    {
      label: `Create RFQ${appliedShipmentCount > 0 ? ` (${appliedShipmentCount})` : ''}`,
      onClick: onCreateRFQ,
      variant: 'secondary',
      tooltip: 'Send RFQ to freight forwarders for selected shipments',
      icon: <FileText className="w-4 h-4" />,
      disabled: isCreatingRFQ || appliedShipmentCount === 0,
    },
    {
      label: 'Export Report',
      onClick: onExportReport,
      variant: 'ghost',
      tooltip: 'Export shipping plans summary report',
      icon: <Download className="w-4 h-4" />,
    },
  ]

  return <ActionBar actions={actions} collapsible={false} />
}

