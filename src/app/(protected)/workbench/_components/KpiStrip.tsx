"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface KpiItem {
  key: string
  label: string
  value: string | number
  delta?: number
  hint?: string
  onClick?: () => void
  icon?: LucideIcon
  iconColor?: string
  bgColor?: string
  textColor?: string
}

interface KpiStripProps {
  items: KpiItem[]
  isLoading?: boolean
  className?: string
}

function KpiCard({ item }: { item: KpiItem }) {
  const Icon = item.icon
  const defaultIconColor = "text-blue-400"
  const defaultBgColor = "bg-gradient-to-br from-blue-900/50 to-blue-800/30"
  const defaultTextColor = "text-blue-200"

  return (
    <Card
      className={cn(
        "dashboard-card hover:shadow-lg transition-shadow",
        item.onClick && "cursor-pointer",
        item.bgColor || defaultBgColor
      )}
      onClick={item.onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              {item.label}
            </p>
            <p className={cn("text-2xl font-bold", item.textColor || defaultTextColor)}>
              {item.value}
            </p>
            {item.delta !== undefined && (
              <p className={cn(
                "text-xs mt-1",
                item.delta >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {item.delta >= 0 ? "+" : ""}{item.delta}% vs prior period
              </p>
            )}
            {item.hint && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.hint}
              </p>
            )}
          </div>
          {Icon && (
            <Icon className={cn("h-6 w-6", item.iconColor || defaultIconColor)} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiStrip({ items, isLoading, className }: KpiStripProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="dashboard-card">
            <CardContent className="p-4">
              <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", className)}>
      {items.map((item) => (
        <KpiCard key={item.key} item={item} />
      ))}
    </div>
  )
}

