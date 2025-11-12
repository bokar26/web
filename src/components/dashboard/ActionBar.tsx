"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Menu } from "lucide-react"

export interface ActionBarAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  disabled?: boolean
  tooltip?: string
  icon?: React.ReactNode
}

interface ActionBarProps {
  actions: ActionBarAction[]
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}

export function ActionBar({ actions, collapsible = false, defaultCollapsed = false, className = "" }: ActionBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // On mobile, always show as collapsible menu
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (isMobile && collapsible) {
    return (
      <Card className={`dashboard-card ${className}`}>
        <CardContent className="p-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between text-white hover:bg-gray-700 rounded p-2"
            aria-label="Toggle actions menu"
          >
            <span className="flex items-center gap-2">
              <Menu className="w-4 h-4" />
              Actions
            </span>
            {isMobileMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isMobileMenuOpen && (
            <div className="mt-2 space-y-2">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="w-full justify-start"
                  title={action.tooltip}
                  aria-label={action.tooltip || action.label}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (collapsible) {
    return (
      <Card className={`dashboard-card ${className}`}>
        <CardContent className="p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-between text-white hover:bg-gray-700 rounded p-2 mb-2"
            aria-label="Toggle actions"
          >
            <span>Actions</span>
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!isCollapsed && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  title={action.tooltip}
                  aria-label={action.tooltip || action.label}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`dashboard-card ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'outline'}
              onClick={action.onClick}
              disabled={action.disabled}
              title={action.tooltip}
              aria-label={action.tooltip || action.label}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

