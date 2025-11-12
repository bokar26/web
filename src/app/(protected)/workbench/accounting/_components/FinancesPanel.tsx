"use client"

import { financialData } from "@/lib/mockData"
import { DollarSign, TrendingUp, AlertTriangle, BarChart3, PieChart as PieChartIcon } from "lucide-react"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

export function FinancesPanel() {
  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'critical':
        return 'text-red-400 bg-red-900/20 border-red-500/30'
      case 'warning':
        return 'text-amber-400 bg-amber-900/20 border-amber-500/30'
      case 'good':
        return 'text-green-400 bg-green-900/20 border-green-500/30'
      default:
        return 'text-gray-600 dark:text-white bg-gray-900/20 border-gray-500/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-amber-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-gray-600 dark:text-white'
    }
  }

  return (
    <div className="space-y-6">
      {/* Anomaly Banner */}
      {financialData.anomalies.length > 0 && (
        <Card className="dashboard-card p-4 border-l-4 border-red-500">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-red-400">Financial Anomalies Detected</h3>
              <div className="space-y-1 mt-1">
                {financialData.anomalies.map((anomaly, index) => (
                  <p key={index} className={`text-sm ${getSeverityColor(anomaly.severity)}`}>
                    • {anomaly.description}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Composition Donut */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5" />
                <span>Total Cost Composition</span>
              </h3>
              <div className="text-sm text-gray-600 dark:text-white">Last 30 days</div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialData.costComposition}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {financialData.costComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {financialData.costComposition.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-900 dark:text-white">{item.category}</span>
                  <span className="text-sm font-medium text-white ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Per Unit Trend */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Cost Per Unit Trend</span>
              </h3>
              <div className="text-sm text-gray-600 dark:text-white">Weekly average</div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData.costPerUnitTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    dataKey="cost" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-white">Current Average</span>
                <span className="text-lg font-bold text-white">
                  ${financialData.costPerUnitTrend[financialData.costPerUnitTrend.length - 1].cost}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600 dark:text-white">vs Last Month</span>
                <span className="text-sm text-green-400">-5.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Margin Analysis Table */}
      <Card className="dashboard-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Margin Analysis by Product</span>
          </h3>
          <div className="text-sm text-gray-600 dark:text-white">Last 30 days</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-sm font-medium text-gray-900 dark:text-white py-3">Product</th>
                <th className="text-left text-sm font-medium text-gray-900 dark:text-white py-3">Route</th>
                <th className="text-right text-sm font-medium text-gray-900 dark:text-white py-3">Margin %</th>
                <th className="text-right text-sm font-medium text-gray-900 dark:text-white py-3">Variance</th>
                <th className="text-center text-sm font-medium text-gray-900 dark:text-white py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {financialData.marginByProduct.map((product, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-100 dark:bg-gray-900/50">
                  <td className="py-3">
                    <div className="text-sm font-medium text-white">{product.product}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm text-gray-900 dark:text-white">{product.route}</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="text-sm font-medium text-white">{product.margin}%</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className={`text-sm font-medium ${
                      product.variance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {product.variance >= 0 ? '+' : ''}{product.variance}%
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getFlagColor(product.flag)}`}>
                      {product.flag.toUpperCase()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-600 dark:text-white">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">$2.4M</div>
            <div className="text-sm text-green-400">+12.5% vs last month</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-white">Avg Margin</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">22.3%</div>
            <div className="text-sm text-green-400">+1.2% vs last month</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-gray-600 dark:text-white">Cost Variance</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">3.2%</div>
            <div className="text-sm text-red-400">+0.8% vs target</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-600 dark:text-white">Anomalies</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{financialData.anomalies.length}</div>
            <div className="text-sm text-gray-600 dark:text-white">Active alerts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

