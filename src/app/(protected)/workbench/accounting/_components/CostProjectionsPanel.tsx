"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

// Mock data for cost projections
const costProjectionData = [
  { month: 'Jan', budget: 450000, actual: 420000, forecast: 480000, variance: -6.7 },
  { month: 'Feb', budget: 480000, actual: 465000, forecast: 520000, variance: -3.1 },
  { month: 'Mar', budget: 520000, actual: 510000, forecast: 560000, variance: -1.9 },
  { month: 'Apr', budget: 500000, actual: 520000, forecast: 540000, variance: 4.0 },
  { month: 'May', budget: 550000, actual: 540000, forecast: 580000, variance: -1.8 },
  { month: 'Jun', budget: 580000, actual: 600000, forecast: 620000, variance: 3.4 },
  { month: 'Jul', budget: 600000, actual: 590000, forecast: 640000, variance: -1.7 },
  { month: 'Aug', budget: 620000, actual: 650000, forecast: 660000, variance: 4.8 },
  { month: 'Sep', budget: 650000, actual: 640000, forecast: 680000, variance: -1.5 },
  { month: 'Oct', budget: 680000, actual: 700000, forecast: 720000, variance: 2.9 },
  { month: 'Nov', budget: 700000, actual: 720000, forecast: 750000, variance: 2.9 },
  { month: 'Dec', budget: 750000, actual: 0, forecast: 780000, variance: 0 },
]

const budgetVsActual = [
  { period: 'Q1', budget: 1450000, actual: 1395000, variance: -3.8 },
  { period: 'Q2', budget: 1630000, actual: 1740000, variance: 6.7 },
  { period: 'Q3', budget: 1870000, actual: 1880000, variance: 0.5 },
  { period: 'Q4', budget: 2130000, actual: 0, variance: 0 },
]

export function CostProjectionsPanel() {
  return (
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
  )
}

