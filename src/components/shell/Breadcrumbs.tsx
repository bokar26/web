"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { getContextNavBySection, getRailSections } from "@/config/nav"
import { useShellContext } from "./ShellContext"

export function Breadcrumbs() {
  const pathname = usePathname()
  const { currentSection, navVariant } = useShellContext()
  const contextNavBySection = getContextNavBySection(navVariant)
  const railSections = getRailSections(navVariant)

  const breadcrumbs = useMemo(() => {
    const crumbs: string[] = []
    
    // Get current rail section
    const railSection = railSections.find(s => s.id === currentSection)
    if (railSection) {
      crumbs.push(railSection.label)
    }

    // Find the current page in the nav structure
    const navNodes = contextNavBySection[currentSection] || []
    
    for (const node of navNodes) {
      if (node.type === 'item') {
        if (pathname === node.href || (node.href !== "/dashboard" && pathname.startsWith(node.href + "/"))) {
          // Only add item label if it's not the root dashboard (Supply Center)
          if (node.href !== "/dashboard" || pathname === "/dashboard") {
            crumbs.push(node.label)
          }
          break
        }
      } else if (node.type === 'folder') {
        // Check if any item in this folder matches
        const matchingItem = node.items.find(
          (item) => pathname === item.href || pathname.startsWith(item.href + "/")
        )
        if (matchingItem) {
          crumbs.push(node.label)
          crumbs.push(matchingItem.label)
          break
        }
      }
    }

    return crumbs
  }, [pathname, currentSection, contextNavBySection, railSections])

  // Don't show breadcrumbs if we're not in dashboard/admin or if only one crumb
  if ((!pathname.startsWith("/dashboard") && !pathname.startsWith("/admin")) || breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 px-6 pt-6 pb-2">
      {breadcrumbs.map((crumb, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <span
            className={
              index === breadcrumbs.length - 1
                ? "text-gray-900 dark:text-white font-medium"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            {crumb}
          </span>
        </span>
      ))}
    </nav>
  )
}

