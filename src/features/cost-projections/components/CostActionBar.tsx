"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calculator, Download, FileText, Save, Play, Plus } from "lucide-react"

interface Scope {
  period: string
  category: string
  supplier: string
  confidence: number
}

interface CostActionBarProps {
  scope: Scope
  onRecompute: () => void
  onCreateScenario: () => void
  onExport: (format: 'csv' | 'pdf') => void
  onSaveBaseline: () => void
  isRunning: boolean
  status?: string
}

export function CostActionBar({
  scope,
  onRecompute,
  onCreateScenario,
  onExport,
  onSaveBaseline,
  isRunning,
  status,
}: CostActionBarProps) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border/60 mb-4 -mx-6 px-6 py-3 bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4">
        {/* Scope Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-gray-800 text-white border-gray-600">
            Period: {scope.period}
          </Badge>
          <Badge variant="secondary" className="bg-gray-800 text-white border-gray-600">
            Category: {scope.category}
          </Badge>
          <Badge variant="secondary" className="bg-gray-800 text-white border-gray-600">
            Supplier: {scope.supplier}
          </Badge>
          <Badge variant="secondary" className="bg-gray-800 text-white border-gray-600">
            Confidence: {scope.confidence}%
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={onRecompute}
            disabled={isRunning}
            title="Recompute cost projections for current scope"
          >
            <Play className="w-4 h-4 mr-2" />
            Recompute
          </Button>
          <Button
            variant="secondary"
            onClick={onCreateScenario}
            disabled={isRunning}
            title="Create a new scenario"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Scenario
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isRunning} title="Export projections">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
              <DropdownMenuItem onClick={() => onExport('csv')}>
                <FileText className="w-4 h-4 mr-2" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')} disabled>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF (Coming Soon)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={onSaveBaseline}
            disabled={isRunning}
            title="Save current projections as baseline"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Baseline
          </Button>
          {status && (
            <Badge variant="secondary" className="bg-blue-900/20 text-blue-400 border-blue-500/30">
              {status}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

