"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { EditAssumptionsDialog } from "@/features/cost-projections/components/EditAssumptionsDialog"
import { useState } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Scope {
  period: string
  category: string
  supplier: string
  confidence: number
}

interface CostWorkbenchStripProps {
  scope: Scope
  onEditAssumptions: () => void
  kpiData?: {
    totalProjectedCost: number
    budgetVariance: number
    costAccuracy: number
    riskLevel: string
  }
}

// Mock data - in production, fetch from server
const costProjectionData = [
  { month: 'Jan', budget: 450000, actual: 420000, forecast: 480000, variance: -6.7 },
  { month: 'Feb', budget: 480000, actual: 465000, forecast: 520000, variance: -3.1 },
  { month: 'Mar', budget: 520000, actual: 510000, forecast: 560000, variance: -1.9 },
  { month: 'Apr', budget: 500000, actual: 520000, forecast: 540000, variance: 4.0 },
  { month: 'May', budget: 550000, actual: 540000, forecast: 580000, variance: -1.8 },
  { month: 'Jun', budget: 580000, actual: 600000, forecast: 620000, variance: 3.4 },
]

const budgetVsActual = [
  { period: 'Q1', budget: 1450000, actual: 1395000, variance: -3.8 },
  { period: 'Q2', budget: 1630000, actual: 1740000, variance: 6.7 },
  { period: 'Q3', budget: 1870000, actual: 1880000, variance: 0.5 },
  { period: 'Q4', budget: 2130000, actual: 0, variance: 0 },
]

export function CostWorkbenchStrip({ scope, onEditAssumptions, kpiData }: CostWorkbenchStripProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const defaultKpiData = {
    totalProjectedCost: 7800000,
    budgetVariance: 2.3,
    costAccuracy: 94.2,
    riskLevel: 'Medium',
  }

  const kpis = kpiData || defaultKpiData

  return (
    <div className="space-y-6">
      {/* Edit Assumptions Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setIsEditDialogOpen(true)}
          className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Assumptions
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-card-title">Budget vs Actual vs Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={costProjectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="budget"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name="Budget"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  name="Actual"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stackId="3"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.3}
                  name="Forecast"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-card-title">Quarterly Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetVsActual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="period" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                <Bar dataKey="actual" fill="#10B981" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Zero State */}
      {costProjectionData.length === 0 && (
        <Card className="dashboard-card">
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 dark:text-white">Apply supplier quotes to see data</p>
          </CardContent>
        </Card>
      )}

      <EditAssumptionsDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        scope="global"
        onSave={onEditAssumptions}
      />
    </div>
  )
}

