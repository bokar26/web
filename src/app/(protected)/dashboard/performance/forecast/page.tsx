"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Brain,
  Target,
  SlidersHorizontal
} from "lucide-react"

export default function ForecastRiskPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forecast & Risk</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Export Forecast</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Dashboard</span>
        <span>/</span>
        <span>Performance</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Forecast & Risk</span>
      </nav>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">SLA Compliance Forecast</p>
              <p className="text-3xl font-bold text-emerald-400">94.2%</p>
              <p className="text-sm text-emerald-500 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.1% predicted
              </p>
            </div>
            <Target className="h-8 w-8 text-emerald-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Risk Score</p>
              <p className="text-3xl font-bold text-amber-400">Medium</p>
              <p className="text-sm text-amber-500 flex items-center mt-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                3 factors identified
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Demand Forecast Accuracy</p>
              <p className="text-3xl font-bold text-blue-400">87.5%</p>
              <p className="text-sm text-blue-500 flex items-center mt-1">
                <BarChart3 className="h-4 w-4 mr-1" />
                ±5% variance
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">AI Confidence</p>
              <p className="text-3xl font-bold text-purple-400">92%</p>
              <p className="text-sm text-purple-500 flex items-center mt-1">
                <Brain className="h-4 w-4 mr-1" />
                High confidence
              </p>
            </div>
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 14-Day SLA Compliance Forecast */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">14-Day SLA Compliance Forecast</h3>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-600 dark:text-white mx-auto mb-2" />
              <p className="text-gray-600 dark:text-white">SLA compliance forecast chart</p>
              <p className="text-sm text-gray-500">Predicted to maintain 94%+ compliance</p>
            </div>
          </div>
        </CardContent>
        </Card>

        {/* Risk Heatmap */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Heatmap</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
              <span className="text-green-300 text-xs">Low</span>
            </div>
            <div className="h-16 bg-amber-500/20 border border-amber-500/30 rounded flex items-center justify-center">
              <span className="text-amber-300 text-xs">Medium</span>
            </div>
            <div className="h-16 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center">
              <span className="text-red-300 text-xs">High</span>
            </div>
            <div className="h-16 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
              <span className="text-green-300 text-xs">Low</span>
            </div>
            <div className="h-16 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
              <span className="text-green-300 text-xs">Low</span>
            </div>
            <div className="h-16 bg-amber-500/20 border border-amber-500/30 rounded flex items-center justify-center">
              <span className="text-amber-300 text-xs">Medium</span>
            </div>
            <div className="h-16 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
              <span className="text-green-300 text-xs">Low</span>
            </div>
            <div className="h-16 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center">
              <span className="text-red-300 text-xs">High</span>
            </div>
            <div className="h-16 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
              <span className="text-green-300 text-xs">Low</span>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* What-If Simulator */}
      <Card className="dashboard-card">
          <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What-If Scenario Simulator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Demand Increase (%)</label>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-600 dark:text-white" />
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  defaultValue="10"
                  className="flex-1"
                />
                <span className="text-gray-900 dark:text-white w-12">10%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Lead Time Extension (days)</label>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-600 dark:text-white" />
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  defaultValue="5"
                  className="flex-1"
                />
                <span className="text-gray-900 dark:text-white w-12">5d</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Supplier Capacity (%)</label>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-600 dark:text-white" />
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  defaultValue="85"
                  className="flex-1"
                />
                <span className="text-gray-900 dark:text-white w-12">85%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-medium text-blue-200 mb-2">Impact on SLA Compliance</h4>
              <p className="text-sm text-blue-300">Predicted: 89.2% (-5.0%)</p>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <h4 className="font-medium text-amber-200 mb-2">Risk Level</h4>
              <p className="text-sm text-amber-300">Medium → High</p>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-medium text-red-200 mb-2">Critical Suppliers</h4>
              <p className="text-sm text-red-300">3 suppliers at risk</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Run Simulation
            </Button>
            <Button variant="outline" className="w-full">
              Save Scenario
            </Button>
            <Button variant="outline" className="w-full">
              Export Results
            </Button>
          </div>
        </div>
      </CardContent>
        </Card>

      {/* AI Risk Analysis Summary */}
      <Card className="dashboard-card">
          <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Risk Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-200">Positive Indicators</span>
              </div>
              <ul className="text-sm text-green-300 space-y-1">
                <li>• Supplier performance trending upward</li>
                <li>• Inventory levels optimal</li>
                <li>• Weather patterns favorable</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="font-medium text-red-200">Risk Factors</span>
              </div>
              <ul className="text-sm text-red-300 space-y-1">
                <li>• Port congestion in Shanghai</li>
                <li>• Rising fuel costs</li>
                <li>• Labor shortage in manufacturing</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-200">AI Recommendations</span>
              </div>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Diversify supplier portfolio</li>
                <li>• Increase safety stock by 15%</li>
                <li>• Negotiate backup shipping routes</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-purple-200">Next Actions</span>
              </div>
              <ul className="text-sm text-purple-300 space-y-1">
                <li>• Review supplier contracts</li>
                <li>• Update risk mitigation plans</li>
                <li>• Schedule monthly review</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
        </Card>
    </div>
  )
}
