"use client";


import { inventoryPlans, demandForecastData } from "@/lib/mockData";
import { Package, AlertTriangle, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPlansPage() {
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

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Inventory Plans</h1>
        <p className="text-gray-900 dark:text-white">Balance stock levels with AI-driven demand forecasts and optimize working capital</p>
      </div>

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
                <div key={plan.sku} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50">
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
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Generate Orders
              </Button>
            </div>

            <div className="space-y-3">
              {inventoryPlans.map((plan) => (
                <div key={plan.sku} className="p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
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

                  <div className="flex items-center justify-between text-sm">
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
    </div>
  );
}
