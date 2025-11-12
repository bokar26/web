"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, PackageSearch, ClipboardList, FolderKanban, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkbenchNavItem {
  label: string
  action: string
}

interface WorkbenchNavFolder {
  label: string
  icon: typeof PackageSearch
  items: WorkbenchNavItem[]
}

const workbenchFolders: WorkbenchNavFolder[] = [
  {
    label: "Procurement",
    icon: PackageSearch,
    items: [
      { label: "Raise PO", action: "raise-po" },
      { label: "View Quotes", action: "view-quotes" },
      { label: "Supplier Selection", action: "supplier-selection" },
    ],
  },
  {
    label: "Planning",
    icon: ClipboardList,
    items: [
      { label: "Run Forecast", action: "run-forecast" },
      { label: "Create Replenishment Plan", action: "replenish" },
      { label: "Cost Simulation", action: "cost-sim" },
    ],
  },
  {
    label: "Manage",
    icon: FolderKanban,
    items: [
      { label: "Upload Documents", action: "upload-doc" },
      { label: "Create Task", action: "create-task" },
      { label: "Manage Exceptions", action: "exceptions" },
    ],
  },
  {
    label: "Performance",
    icon: BarChart3,
    items: [
      { label: "View Audit Logs", action: "audit-logs" },
      { label: "Track Runs", action: "track-runs" },
    ],
  },
]

interface WorkbenchNavProps {
  onActionSelect?: (action: string) => void
}

export function WorkbenchNav({ onActionSelect }: WorkbenchNavProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(workbenchFolders.map((f) => f.label))
  )

  const toggleFolder = (folderLabel: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderLabel)) {
        next.delete(folderLabel)
      } else {
        next.add(folderLabel)
      }
      return next
    })
  }

  return (
    <nav className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black p-4 space-y-2">
      {workbenchFolders.map((folder) => {
        const isExpanded = expandedFolders.has(folder.label)
        const Icon = folder.icon

        return (
          <div key={folder.label} className="space-y-1">
            <button
              onClick={() => toggleFolder(folder.label)}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                "text-gray-600 dark:text-white",
                "hover:bg-gray-100 dark:hover:bg-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{folder.label}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isExpanded && (
              <div className="ml-6 space-y-1">
                {folder.items.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => onActionSelect?.(item.action)}
                    className={cn(
                      "block w-full px-3 py-1.5 text-sm rounded transition-colors text-left",
                      "text-gray-500 dark:text-gray-400",
                      "hover:bg-gray-100 dark:hover:bg-gray-900",
                      "hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

