"use client";

import { GaugeChart } from "./atoms/GaugeChart";
import { GlassCard } from "./atoms/GlassCard";
import { slaHealthData } from "@/lib/mockData";

export function SLAHealthGauge() {
  const { current, target, status } = slaHealthData;
  
  const getStatusColor = () => {
    if (current >= target) return "#10b981"; // green
    if (current >= target - 5) return "#f59e0b"; // amber
    return "#dc2626"; // red
  };

  const getStatusText = () => {
    switch (status) {
      case 'improving':
        return 'SLA health improving';
      case 'declining':
        return 'SLA health declining';
      default:
        return 'SLA health stable';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">SLA Health</h3>
        <div className="text-sm text-gray-400">
          Target: {target}%
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <GaugeChart
          value={current}
          max={100}
          size={140}
          color={getStatusColor()}
          label="Compliance"
        />
      </div>
      
      <div className="text-center">
        <p className={`text-sm font-medium ${
          status === 'improving' ? 'text-green-400' :
          status === 'declining' ? 'text-red-400' :
          'text-gray-400'
        }`}>
          {getStatusText()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {current}% of {target}% target
        </p>
      </div>
    </GlassCard>
  );
}
