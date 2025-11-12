"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, CheckCircle, Target, DollarSign, BarChart3 } from "lucide-react"

interface CostKpiGridProps {
  totalProjectedCost?: number
  budgetVariance?: number
  costAccuracy?: number
  riskLevel?: string
}

export function CostKpiGrid({
  totalProjectedCost = 7800000,
  budgetVariance = 2.3,
  costAccuracy = 94.2,
  riskLevel = "Medium",
}: CostKpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Total Projected Cost</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(totalProjectedCost / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% vs current
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Budget Variance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {budgetVariance >= 0 ? '+' : ''}{budgetVariance}%
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Above budget
              </p>
            </div>
            <Target className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Cost Accuracy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{costAccuracy}%</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                High accuracy
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{riskLevel}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Monitor closely
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

