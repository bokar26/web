"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  ctaLabel: string
  onAction: () => void | Promise<void>
  isRunning?: boolean
  disabled?: boolean
  className?: string
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  ctaLabel,
  onAction,
  isRunning = false,
  disabled = false,
  className,
}: QuickActionCardProps) {
  return (
    <Card className={cn("dashboard-card hover:shadow-lg transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Icon className="h-5 w-5 text-emerald-500" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onAction}
          disabled={disabled || isRunning}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            ctaLabel
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// Variants
interface RunForecastCardProps {
  onRun: () => void | Promise<void>
  isRunning?: boolean
  disabled?: boolean
}

export function RunForecastCard({ onRun, isRunning, disabled }: RunForecastCardProps) {
  return (
    <QuickActionCard
      title="Run Forecast"
      description="Generate demand forecast for current period"
      ctaLabel="Run Forecast"
      onAction={onRun}
      isRunning={isRunning}
      disabled={disabled}
    />
  )
}

interface CreatePoCardProps {
  onCreate: () => void | Promise<void>
  disabled?: boolean
}

export function CreatePoCard({ onCreate, disabled }: CreatePoCardProps) {
  return (
    <QuickActionCard
      title="New Purchase Order"
      description="Create a new purchase order"
      ctaLabel="Create PO"
      onAction={onCreate}
      disabled={disabled}
    />
  )
}

interface BookShipmentCardProps {
  onBook: () => void | Promise<void>
  disabled?: boolean
}

export function BookShipmentCard({ onBook, disabled }: BookShipmentCardProps) {
  return (
    <QuickActionCard
      title="Book Shipment"
      description="Book a new shipment"
      ctaLabel="Book Shipment"
      onAction={onBook}
      disabled={disabled}
    />
  )
}

