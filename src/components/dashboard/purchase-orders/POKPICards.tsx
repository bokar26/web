"use client"

import React from "react"
import { GlassCard } from "@/components/dashboard/atoms/GlassCard"
import { poKPIs } from "@/lib/mockData"
import { ArrowDown, ArrowUp, CheckCircle, Clock, DollarSign, Package, Truck } from "lucide-react"

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'none';
  trendText?: string;
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass?: string;
  textColorClass?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  trendText,
  icon: Icon,
  iconColorClass,
  bgColorClass = "bg-card",
  textColorClass = "text-card-foreground"
}) => {
  const trendColorClass = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : null;

  return (
    <GlassCard className={`p-5 flex flex-col justify-between h-full ${bgColorClass}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <Icon className={`h-6 w-6 ${iconColorClass}`} />
      </div>
      <div className="mt-4">
        <p className={`text-3xl font-bold ${textColorClass}`}>{value}</p>
        {trendText && (
          <p className={`text-sm flex items-center mt-1 ${trendColorClass}`}>
            {TrendIcon && <TrendIcon className="h-4 w-4 mr-1" />}
            {trendText}
          </p>
        )}
      </div>
    </GlassCard>
  )
}

export const POKPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Active POs"
        value={poKPIs.totalActive}
        icon={Package}
        iconColorClass="text-blue-400"
        bgColorClass="bg-gradient-to-br from-blue-900/50 to-blue-800/30"
        textColorClass="text-blue-200"
      />
      <KPICard
        title="POs On Time %"
        value={`${poKPIs.onTimePercentage}%`}
        trend={poKPIs.onTimePercentage >= 90 ? 'up' : 'down'}
        trendText={poKPIs.onTimePercentage >= 90 ? 'Above target' : 'Below target'}
        icon={CheckCircle}
        iconColorClass="text-emerald-400"
        bgColorClass="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30"
        textColorClass="text-emerald-200"
      />
      <KPICard
        title="POs Delayed %"
        value={`${poKPIs.delayedPercentage}%`}
        trend={poKPIs.delayedPercentage <= 10 ? 'down' : 'up'}
        trendText={poKPIs.delayedPercentage <= 10 ? 'Improving' : 'Needs attention'}
        icon={Clock}
        iconColorClass="text-red-400"
        bgColorClass="bg-gradient-to-br from-red-900/50 to-red-800/30"
        textColorClass="text-red-200"
      />
      <KPICard
        title="Avg Cycle Time (days)"
        value={poKPIs.avgCycleTime}
        trend={poKPIs.avgCycleTime <= 30 ? 'down' : 'up'}
        trendText={poKPIs.avgCycleTime <= 30 ? 'Efficient' : 'Extended'}
        icon={Truck}
        iconColorClass="text-purple-400"
        bgColorClass="bg-gradient-to-br from-purple-900/50 to-purple-800/30"
        textColorClass="text-purple-200"
      />
    </div>
  )
}

export const POMiniKPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <KPICard
        title="POs Pending Confirmation"
        value={poKPIs.pendingConfirmation}
        icon={Clock}
        iconColorClass="text-amber-400"
        bgColorClass="bg-gradient-to-br from-amber-900/50 to-amber-800/30"
        textColorClass="text-amber-200"
      />
      <KPICard
        title="Avg Fulfillment %"
        value={`${poKPIs.avgFulfillment}%`}
        icon={Package}
        iconColorClass="text-cyan-400"
        bgColorClass="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30"
        textColorClass="text-cyan-200"
      />
    </div>
  )
}
