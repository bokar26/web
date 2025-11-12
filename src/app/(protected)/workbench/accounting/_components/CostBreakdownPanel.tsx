"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

const costBreakdown = [
  { category: 'Raw Materials', current: 35, projected: 38, trend: 'up' },
  { category: 'Labor', current: 25, projected: 26, trend: 'up' },
  { category: 'Transportation', current: 15, projected: 12, trend: 'down' },
  { category: 'Overhead', current: 12, projected: 13, trend: 'up' },
  { category: 'Packaging', current: 8, projected: 7, trend: 'down' },
  { category: 'Other', current: 5, projected: 4, trend: 'down' },
]

export function CostBreakdownPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Cost Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="current"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Category Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costBreakdown.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{category.category}</p>
                  <p className="text-sm text-gray-600 dark:text-white">
                    {category.current}% → {category.projected}%
                  </p>
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  category.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {category.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {category.trend === 'up' ? '+' : ''}{Math.abs(category.projected - category.current)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

