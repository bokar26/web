"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button"
import { CardSharp as Card, CardContent } from "@/components/ui/card-sharp"
import { GoalProgress } from "@/components/dashboard/GoalProgress"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { DashboardEditor } from "@/components/dashboard/DashboardEditor"
import { loadLayout, LayoutState } from "@/lib/dashboard-config"
import { Search, Truck } from "lucide-react"
import Link from "next/link"
import { SLAHealthGauge } from "@/components/dashboard/SLAHealthGauge"
import { RiskSnapshot } from "@/components/dashboard/RiskSnapshot"
import { SupplyMap } from "@/components/dashboard/SupplyMap"
import { CostInventoryPanel } from "@/components/dashboard/CostInventoryPanel"
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline"
import { secondaryMetrics } from "@/lib/mockData"

// Defer heavy chart components with requestIdleCallback
const MetricChart = dynamic(() => import("@/components/dashboard/MetricChart").then(m => ({ default: m.MetricChart })), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-200 dark:bg-gray-900 rounded animate-pulse" />
});

const VendorBreakdown = dynamic(() => import("@/components/dashboard/VendorBreakdown").then(m => ({ default: m.VendorBreakdown })), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-200 dark:bg-gray-900 rounded animate-pulse" />
});

const SLASuggestions = dynamic(() => import("@/components/dashboard/SLASuggestions").then(m => ({ default: m.SLASuggestions })), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-200 dark:bg-gray-900 rounded animate-pulse" />
});

const TrendHeatmap = dynamic(() => import("@/components/dashboard/TrendHeatmap").then(m => ({ default: m.TrendHeatmap })), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-200 dark:bg-gray-900 rounded animate-pulse" />
});

function ChartWhenIdle({ component: Component, ...props }: { component: React.ComponentType<Record<string, unknown>>; [key: string]: unknown }) {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const run = () => setReady(true);
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(run);
    } else {
      setTimeout(run, 0);
    }
  }, []);

  return ready ? <Component {...props} /> : <div className="h-48 bg-gray-200 dark:bg-gray-900 rounded animate-pulse" />;
}

interface DashboardContentProps {
  kpis: Array<{
    title: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
  }>
  cccTrendData: Array<{ date: string; value: number }>
  shipTimeTrendData: Array<{ date: string; value: number }>
  additionalMetrics: Array<{
    title: string
    value: string
    subtitle: string
  }>
  currentGoal: {
    title: string
    current: number
    target: number
    unit: string
    progress: number
    percentOfGoal: number
  }
  vendorBreakdownData: Array<{ name: string; value: number; color: string }>
  slaSuggestions: Array<{
    title: string
    description: string
    impact: string
    type: 'optimization' | 'cost' | 'time'
  }>
  heatmapData: Array<{
    date: string
    value: number
  }>
}

export function DashboardContent({ 
  kpis, 
  cccTrendData, 
  shipTimeTrendData,
  additionalMetrics,
  currentGoal,
  vendorBreakdownData,
  slaSuggestions,
  heatmapData
}: DashboardContentProps) {
  const [layout, setLayout] = useState<LayoutState>([]);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setLayout(loadLayout());
  }, []);

  const handleLayoutChange = (newLayout: LayoutState) => {
    setLayout(newLayout);
  };

  const isCardVisible = (key: string) => {
    const card = layout.find(c => c.key === key);
    return card ? card.visible : true;
  };

  return (
    <div className="dashboard-bg min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Supply Center
          </h1>
          <p className="text-gray-300 mt-1">
            Your unified view for suppliers, fulfillment, and insights.
          </p>
        </div>
      </div>

      {/* Goal Progress */}
      {isCardVisible('goal') && (
        <GoalProgress 
          title={currentGoal.title}
          progress={currentGoal.progress}
          target={currentGoal.target}
          percentOfGoal={currentGoal.percentOfGoal}
          onEditDashboard={() => setShowEditor(true)}
        />
      )}

      {/* Quick Actions - Time & Cost Savings */}
      {isCardVisible('timeSavings') && isCardVisible('costSavings') && (
        <QuickActions 
          timeSaved={{
            total: 12,
            saved: 6,
            withoutSLA: 18
          }}
          costSaved={{
            total: 265000,
            saved: 45000,
            withoutSLA: 310000
          }}
        />
      )}

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryMetrics.map((metric, index) => (
          <Card key={index} className="dashboard-card hover:shadow-lg transition-shadow">
            <CardContent>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1 leading-tight">
                {metric.value}
              </p>
              <p className={`text-[11px] mt-0.5 ${
                metric.trend === 'up' ? 'text-red-500' : 
                metric.trend === 'down' ? 'text-green-500' : 
                'text-gray-500'
              }`}>
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SLA Health Gauge */}
      <SLAHealthGauge />

      {/* Risk & Breach Snapshot */}
      <RiskSnapshot />

      {/* Charts and Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {isCardVisible('cccTrend') && (
          <MetricChart
            title="Cash Conversion Cycle Trend"
            data={cccTrendData.map(d => ({ name: d.date, value: d.value }))}
            dataKey="value"
            currentValue={66}
            comparisonValue={72}
            unit=" days"
            trend="down"
          />
        )}
        {isCardVisible('shipTrend') && (
          <MetricChart
            title="Shipping Time Trend"
            data={shipTimeTrendData.map(d => ({ name: d.date, value: d.value }))}
            dataKey="value"
            currentValue={25}
            comparisonValue={28}
            unit=" days"
            trend="down"
          />
        )}
      </div>

      {/* Vendor Breakdown and SLA Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {isCardVisible('vendorRegion') && (
          <VendorBreakdown />
        )}
        {isCardVisible('suggestions') && (
          <SLASuggestions
            suggestions={slaSuggestions}
          />
        )}
      </div>

      {/* Map Visualization */}
      <SupplyMap />

      {/* Cost & Inventory Snapshot */}
      <CostInventoryPanel />

      {/* Activity Timeline */}
      <ActivityTimeline />

      {/* Quick Links */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard/search">
          <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white">
            <Search className="h-4 w-4 mr-2" />
            Run Supplier Search
          </Button>
        </Link>
        <Link href="/dashboard/logistics">
          <Button variant="outline" className="w-full sm:w-auto">
            <Truck className="h-4 w-4 mr-2" />
            Plan Route with SLA
          </Button>
        </Link>
      </div>

      {/* Dashboard Editor */}
      {showEditor && (
        <DashboardEditor
          layout={layout}
          onLayoutChange={handleLayoutChange}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  )
}
