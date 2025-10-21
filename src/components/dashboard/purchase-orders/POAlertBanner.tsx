"use client"

import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react"
import { PurchaseOrder } from "@/lib/mockData"

interface POAlertBannerProps {
  orders: PurchaseOrder[];
  onFilterAtRisk: () => void;
  onFilterBreached: () => void;
  onFilterPending: () => void;
}

export const POAlertBanner: React.FC<POAlertBannerProps> = ({
  orders,
  onFilterAtRisk,
  onFilterBreached,
  onFilterPending
}) => {
  const atRiskCount = orders.filter(order => order.slaStatus === 'at-risk').length;
  const breachedCount = orders.filter(order => order.slaStatus === 'breached').length;
  const pendingCount = orders.filter(order => order.status === 'confirmed').length;

  if (atRiskCount === 0 && breachedCount === 0 && pendingCount === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {breachedCount > 0 && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <XCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            <div className="flex items-center justify-between">
              <span>
                <strong>{breachedCount}</strong> purchase orders have breached SLA targets
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onFilterBreached}
                className="border-red-500/50 text-red-200 hover:bg-red-500/20"
              >
                View Breached Orders
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {atRiskCount > 0 && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            <div className="flex items-center justify-between">
              <span>
                <strong>{atRiskCount}</strong> purchase orders are at risk of SLA breach
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onFilterAtRisk}
                className="border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
              >
                View At-Risk Orders
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {pendingCount > 0 && (
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Clock className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <div className="flex items-center justify-between">
              <span>
                <strong>{pendingCount}</strong> purchase orders are pending confirmation
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onFilterPending}
                className="border-blue-500/50 text-blue-200 hover:bg-blue-500/20"
              >
                View Pending Orders
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
