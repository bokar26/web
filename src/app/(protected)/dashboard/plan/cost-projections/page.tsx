"use client";

import { useState } from "react";
import { GlassCard } from "@/components/dashboard/atoms/GlassCard";
import { costEstimatorInputs, costBreakdown } from "@/lib/mockData";
import { DollarSign, Calculator, TrendingUp, Package, Ship, FileText } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

export default function CostProjectionsPage() {
  const [inputs, setInputs] = useState(costEstimatorInputs);
  const [breakdown, setBreakdown] = useState(costBreakdown);

  const costCompositionData = [
    { category: 'Product', value: breakdown.product, color: '#10b981' },
    { category: 'Freight', value: breakdown.freight, color: '#3b82f6' },
    { category: 'Duty', value: breakdown.duty, color: '#f59e0b' },
    { category: 'Misc', value: breakdown.misc, color: '#6b7280' }
  ];

  const scenarioData = [
    { scenario: 'Current', cost: breakdown.total },
    { scenario: 'Optimized', cost: breakdown.total * 0.85 },
    { scenario: 'Premium', cost: breakdown.total * 1.15 }
  ];

  const handleInputChange = (field: string, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Simulate cost recalculation
    const newBreakdown = {
      product: Math.round(breakdown.product * (value / inputs.quantity)),
      freight: Math.round(breakdown.freight * (value / inputs.quantity)),
      duty: inputs.dutyEnabled ? Math.round(breakdown.duty * (value / inputs.quantity)) : 0,
      misc: Math.round(breakdown.misc * (value / inputs.quantity)),
      total: 0
    };
    newBreakdown.total = newBreakdown.product + newBreakdown.freight + newBreakdown.duty + newBreakdown.misc;
    setBreakdown(newBreakdown);
  };

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Cost Projections</h1>
        <p className="text-gray-300">Interactive cost estimator with scenario planning and breakdown analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Cost Parameters</span>
            </h3>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Save Scenario
            </Button>
          </div>

          <div className="space-y-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white pr-16"
                />
                <div className="absolute right-3 top-2 text-gray-400 text-sm">units</div>
              </div>
            </div>

            {/* Port */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
              <select
                value={inputs.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="Shanghai">Shanghai</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Tokyo">Tokyo</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Transport Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {['Sea', 'Air', 'Rail', 'Road'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleInputChange('transportMode', mode)}
                    className={`p-3 rounded-lg text-sm transition-colors ${
                      inputs.transportMode === mode
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Incoterm */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Incoterm</label>
              <select
                value={inputs.incoterm}
                onChange={(e) => handleInputChange('incoterm', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="FOB">FOB (Free On Board)</option>
                <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                <option value="EXW">EXW (Ex Works)</option>
                <option value="DDP">DDP (Delivered Duty Paid)</option>
              </select>
            </div>

            {/* Duty */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={inputs.dutyEnabled}
                onChange={(e) => handleInputChange('dutyEnabled', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <label className="text-sm text-gray-300">Include Duty & Taxes</label>
            </div>
          </div>
        </GlassCard>

        {/* Output Panel */}
        <div className="space-y-6">
          {/* Total Cost */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Total Landed Cost</span>
            </h3>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                ${breakdown.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">per {inputs.quantity} units</div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Product Cost</span>
                </div>
                <span className="text-sm font-medium text-white">${breakdown.product.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-2">
                  <Ship className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Freight Cost</span>
                </div>
                <span className="text-sm font-medium text-white">${breakdown.freight.toLocaleString()}</span>
              </div>
              
              {inputs.dutyEnabled && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-gray-300">Duty & Taxes</span>
                  </div>
                  <span className="text-sm font-medium text-white">${breakdown.duty.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Miscellaneous</span>
                </div>
                <span className="text-sm font-medium text-white">${breakdown.misc.toLocaleString()}</span>
              </div>
            </div>
          </GlassCard>

          {/* Cost Composition Chart */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Cost Composition</h3>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costCompositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
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
                  <span className="text-sm font-medium text-white ml-auto">
                    {Math.round((item.value / breakdown.total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Scenario Comparison */}
      <GlassCard className="p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Scenario Comparison</span>
          </h3>
          <Button variant="outline" className="text-gray-300 border-gray-600">
            Compare Scenarios
          </Button>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="scenario" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#374151' }}
              />
              <Bar 
                dataKey="cost" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {scenarioData.map((scenario, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-800/50 border border-gray-600">
              <div className="text-sm font-medium text-gray-300 mb-2">{scenario.scenario}</div>
              <div className="text-2xl font-bold text-white mb-1">
                ${scenario.cost.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {scenario.cost === breakdown.total ? 'Current' : 
                 scenario.cost < breakdown.total ? '15% savings' : '15% premium'}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
