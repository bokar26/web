"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { contextNavBySection, type ContextNavNode } from "@/config/nav"
import { useShellContext } from "./ShellContext"
import { isWorkbenchEnabled, isTimelineEnabled } from "@/lib/features"

interface ContextNavMobileProps {
  onNavigate?: () => void
}

export function ContextNavMobile({ onNavigate }: ContextNavMobileProps) {
  const pathname = usePathname()
  const { currentSection } = useShellContext()

  // Filter nav nodes based on feature flags
  const navNodes = useMemo(() => {
    // If workbench or timeline is disabled, don't show their nav
    if (currentSection === 'workbench' && !isWorkbenchEnabled()) {
      return []
    }
    if (currentSection === 'timelines' && !isTimelineEnabled()) {
      return []
    }
    return contextNavBySection[currentSection] || []
  }, [currentSection])

  // Expanded folders state (persisted to localStorage)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    const stored = localStorage.getItem(`sla_expanded_folders_mobile_${currentSection}`)
    if (stored) {
      try {
        return new Set(JSON.parse(stored))
      } catch {
        return new Set()
      }
    }
    // Default: all folders expanded on first visit
    const defaultExpanded = new Set<string>()
    navNodes.forEach((node) => {
      if (node.type === 'folder') {
        defaultExpanded.add(node.label)
      }
    })
    return defaultExpanded
  })

  // Persist expanded state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `sla_expanded_folders_mobile_${currentSection}`,
        JSON.stringify(Array.from(expandedFolders))
      )
    }
  }, [expandedFolders, currentSection])

  // Update expanded state when section changes
  useEffect(() => {
    const stored = localStorage.getItem(`sla_expanded_folders_mobile_${currentSection}`)
    if (stored) {
      try {
        setExpandedFolders(new Set(JSON.parse(stored)))
      } catch {
        // If parse fails, default to all expanded
        const defaultExpanded = new Set<string>()
        navNodes.forEach((node) => {
          if (node.type === 'folder') {
            defaultExpanded.add(node.label)
          }
        })
        setExpandedFolders(defaultExpanded)
      }
    } else {
      // Default: all folders expanded
      const defaultExpanded = new Set<string>()
      navNodes.forEach((node) => {
        if (node.type === 'folder') {
          defaultExpanded.add(node.label)
        }
      })
      setExpandedFolders(defaultExpanded)
    }
  }, [currentSection, navNodes])

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

  const renderNode = (node: ContextNavNode, index: number) => {
    if (node.type === 'item') {
      const isActive = pathname === node.href || pathname.startsWith(node.href + "/")
      const Icon = node.icon

      return (
        <Link
          key={node.href}
          href={node.href}
          prefetch={false}
          onClick={onNavigate}
          role="treeitem"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
            "text-gray-600 dark:text-white",
            "hover:bg-gray-100 dark:hover:bg-gray-900",
            "hover:text-gray-900 dark:hover:text-white",
            isActive &&
              "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2"
          )}
          aria-label={node.label}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span>{node.label}</span>
        </Link>
      )
    } else {
      // Folder
      const isExpanded = expandedFolders.has(node.label)
      const FolderIcon = node.icon
      const hasActiveChild = node.items.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
      )

      return (
        <div key={node.label} role="group" className="space-y-1">
          <button
            onClick={() => toggleFolder(node.label)}
            role="treeitem"
            data-folder-label={node.label}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors w-full",
              "text-gray-600 dark:text-white",
              "hover:bg-gray-100 dark:hover:bg-gray-900",
              "hover:text-gray-900 dark:hover:text-white",
              hasActiveChild && "bg-gray-50 dark:bg-gray-900/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2"
            )}
            aria-label={node.label}
            aria-expanded={isExpanded}
          >
            {FolderIcon && <FolderIcon className="h-5 w-5 flex-shrink-0" />}
            <span className="flex-1 text-left">{node.label}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-6 space-y-1" role="group">
              {node.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={onNavigate}
                    role="treeitem"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                      "text-gray-500 dark:text-gray-400",
                      "hover:bg-gray-100 dark:hover:bg-gray-900",
                      "hover:text-gray-900 dark:hover:text-white",
                      isActive &&
                        "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2"
                    )}
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <nav role="tree" className="flex flex-col h-full bg-gray-50 dark:bg-black">
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {navNodes.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-4">
            No items available
          </div>
        ) : (
          navNodes.map((node, index) => renderNode(node, index))
        )}
      </div>
    </nav>
  )
}
