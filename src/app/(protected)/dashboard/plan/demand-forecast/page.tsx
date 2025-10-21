"use client";

import { useState } from "react";
import { GlassCard } from "@/components/dashboard/atoms/GlassCard";
import { forecastVersions, forecastAccuracy, demandForecastData } from "@/lib/mockData";
import { BarChart3, TrendingUp, Target, Filter, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";

export default function DemandForecastPage() {
  const [selectedVersion, setSelectedVersion] = useState(forecastVersions[0]);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Demand Forecast</h1>
        <p className="text-gray-300">AI-powered demand forecasting with accuracy metrics and version comparison</p>
      </div>

      {/* Controls */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Version:</span>
              <select 
                value={selectedVersion.id}
                onChange={(e) => setSelectedVersion(forecastVersions.find(v => v.id === e.target.value) || forecastVersions[0])}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
              >
                {forecastVersions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Time Range:</span>
              <div className="flex space-x-1">
                {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      timeRange === range
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" className="text-gray-300 border-gray-600">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Generate Forecast
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Forecast Chart */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Forecast vs Actual</span>
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-400">Forecast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-400">Actual</span>
                </div>
              </div>
            </div>
            
            <div className="h-80">
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
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Accuracy Metrics */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Accuracy Metrics</span>
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-400">MAE</span>
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">{forecastAccuracy.mae}</div>
                <div className="text-xs text-gray-400">Mean Absolute Error</div>
              </div>

              <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-400">MAPE</span>
                  <BarChart3 className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400">{forecastAccuracy.mape}%</div>
                <div className="text-xs text-gray-400">Mean Absolute Percentage Error</div>
              </div>

              <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-400">Bias</span>
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400">{forecastAccuracy.bias}%</div>
                <div className="text-xs text-gray-400">Forecast Bias</div>
              </div>
            </div>
          </GlassCard>

          {/* Version Comparison */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Version Comparison</h3>
            
            <div className="space-y-3">
              {forecastVersions.map((version) => (
                <div
                  key={version.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedVersion.id === version.id
                      ? 'bg-gray-700 border border-green-500'
                      : 'bg-gray-800 border border-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{version.name}</div>
                      <div className="text-xs text-gray-400">Created: {version.createdAt}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">94.2%</div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All SKUs</option>
              <option>TEE-BLK-M</option>
              <option>JEAN-BLU-L</option>
              <option>HOOD-GRY-XL</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia Pacific</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Customer</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Customers</option>
              <option>Zara</option>
              <option>H&M</option>
              <option>Uniqlo</option>
            </select>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
