"use client";

import { GlassCard } from "./atoms/GlassCard";
import { costCompositionData, inventoryForecastData } from "@/lib/mockData";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export function CostInventoryPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cost Composition Donut */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cost Composition</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costCompositionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {costCompositionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {costCompositionData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-300">{item.category}</span>
              <span className="text-sm font-medium text-white ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Inventory Forecast Bar Chart */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Inventory Forecast vs Actual</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="region" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#374151' }}
              />
              <Bar dataKey="forecasted" fill="#3B82F6" name="Forecasted" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actual" fill="#10B981" name="Actual" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-gray-300">Forecasted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-gray-300">Actual</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
