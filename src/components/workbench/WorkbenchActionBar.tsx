"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Play,
  CheckCircle,
  Sliders,
  AlertTriangle,
  Package,
  DollarSign,
  Ship,
  Upload,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkbenchActionBarProps {
  onActionClick?: (action: string) => void
}

export function WorkbenchActionBar({ onActionClick }: WorkbenchActionBarProps) {
  const [scope, setScope] = useState<"all" | "channel" | "category">("all")
  const [period, setPeriod] = useState<string>("current")

  const actions = [
    { id: "run-forecast", label: "Run Forecast", icon: Play, variant: "default" as const },
    { id: "publish", label: "Publish", icon: CheckCircle, variant: "secondary" as const },
    { id: "overrides", label: "Overrides", icon: Sliders, variant: "outline" as const },
    { id: "exceptions", label: "Exceptions", icon: AlertTriangle, variant: "outline" as const },
    { id: "replenish", label: "Replenish", icon: Package, variant: "outline" as const },
    { id: "create-shipment", label: "Create Shipment", icon: Ship, variant: "outline" as const },
    { id: "cost-sim", label: "Cost Sim", icon: DollarSign, variant: "outline" as const },
    { id: "raise-po", label: "Raise PO", icon: FileText, variant: "outline" as const },
    { id: "upload-doc", label: "Upload Doc", icon: Upload, variant: "ghost" as const },
  ]

  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-4 p-4",
        "bg-gray-50/95 dark:bg-black/95 backdrop-blur-sm",
        "border-b border-gray-200/60 dark:border-gray-800/60"
      )}
    >
      {/* Scope Picker */}
      <div className="flex items-center gap-2">
        <Select value={scope} onValueChange={(v) => setScope(v as typeof scope)}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="channel">Channel</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Period</SelectItem>
            <SelectItem value="next">Next Period</SelectItem>
            <SelectItem value="last">Last Period</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {scope === "all" ? "All" : scope === "channel" ? "Channel: Selected" : "Category: Selected"}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant={action.variant}
              size="sm"
              onClick={() => onActionClick?.(action.id)}
              className={cn(
                action.variant === "default" &&
                  "bg-emerald-600 hover:bg-emerald-700 text-white",
                "text-xs"
              )}
            >
              <Icon className="h-4 w-4 mr-1.5" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

