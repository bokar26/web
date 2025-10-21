"use client";

import { useState } from "react";
import { GlassCard } from "@/components/dashboard/atoms/GlassCard";
import { customerMetrics } from "@/lib/mockData";
import { Users, TrendingUp, AlertCircle, CheckCircle, Eye, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customerMetrics[0] | null>(null);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'good':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'at-risk':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'good':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'at-risk':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Customers</h1>
        <p className="text-gray-300">Customer service quality and SLA compliance management</p>
      </div>

      {/* Customer Leaderboard */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Customer Health Leaderboard</span>
          </h3>
          <div className="text-sm text-gray-400">SLA Compliance</div>
        </div>

        <div className="space-y-3">
          {customerMetrics.map((customer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedCustomer?.name === customer.name 
                  ? 'bg-gray-700 border-green-500' 
                  : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{customer.name}</div>
                    <div className="text-xs text-gray-400">
                      {customer.recentOrders} orders • ${customer.revenue.toLocaleString()} revenue
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{customer.otdPercent}%</div>
                    <div className="text-xs text-gray-400">OTD</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{customer.fillRate}%</div>
                    <div className="text-xs text-gray-400">Fill Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{customer.slaCompliance}%</div>
                    <div className="text-xs text-gray-400">SLA</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(customer.health)}
                    <div className={`text-xs px-2 py-1 rounded ${getHealthColor(customer.health)}`}>
                      {customer.health.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      customer.slaCompliance >= 95 ? 'bg-green-500' :
                      customer.slaCompliance >= 90 ? 'bg-blue-500' :
                      customer.slaCompliance >= 80 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${customer.slaCompliance}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Customer Details */}
      {selectedCustomer && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Overview */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedCustomer.name} Overview</h3>
              <Button variant="outline" className="text-gray-300 border-gray-600">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-sm text-gray-400 mb-1">On-Time Delivery</div>
                  <div className="text-2xl font-bold text-white">{selectedCustomer.otdPercent}%</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-sm text-gray-400 mb-1">Fill Rate</div>
                  <div className="text-2xl font-bold text-white">{selectedCustomer.fillRate}%</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/50">
                <div className="text-sm text-gray-400 mb-2">SLA Compliance</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">{selectedCustomer.slaCompliance}%</span>
                  <span className="text-sm text-gray-400">Target: 95%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedCustomer.slaCompliance >= 95 ? 'bg-green-500' :
                      selectedCustomer.slaCompliance >= 90 ? 'bg-blue-500' :
                      selectedCustomer.slaCompliance >= 80 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedCustomer.slaCompliance}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-sm text-gray-400 mb-1">Recent Orders</div>
                  <div className="text-lg font-bold text-white">{selectedCustomer.recentOrders}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-sm text-gray-400 mb-1">Revenue</div>
                  <div className="text-lg font-bold text-white">${selectedCustomer.revenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Recent Activity & Breaches */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">SLA Breaches</span>
                  <span className={`text-sm font-medium ${
                    selectedCustomer.breachCount === 0 ? 'text-green-400' :
                    selectedCustomer.breachCount <= 2 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {selectedCustomer.breachCount}
                  </span>
                </div>
                <div className="text-xs text-gray-400">Last 30 days</div>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/50">
                <div className="text-sm font-medium text-white mb-2">Recent Orders</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Order #12345</span>
                    <span className="text-green-400">Delivered</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Order #12346</span>
                    <span className="text-blue-400">In Transit</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Order #12347</span>
                    <span className="text-amber-400">Delayed</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/50">
                <div className="text-sm font-medium text-white mb-2">Satisfaction Score</div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">4.2/5</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Customer KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Customers</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{customerMetrics.length}</div>
          <div className="text-sm text-green-400">+2 this month</div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Avg SLA Compliance</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(customerMetrics.reduce((sum, c) => sum + c.slaCompliance, 0) / customerMetrics.length)}%
          </div>
          <div className="text-sm text-green-400">+3.2% vs last month</div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Avg OTD</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(customerMetrics.reduce((sum, c) => sum + c.otdPercent, 0) / customerMetrics.length)}%
          </div>
          <div className="text-sm text-green-400">+1.8% vs last month</div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-gray-400">At-Risk Customers</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {customerMetrics.filter(c => c.health === 'at-risk').length}
          </div>
          <div className="text-sm text-gray-400">Require attention</div>
        </GlassCard>
      </div>
    </div>
  );
}
