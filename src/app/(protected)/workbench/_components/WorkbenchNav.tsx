"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navItems = [
  { id: "kpi", label: "KPI", anchor: "#kpi" },
  { id: "execute", label: "Execute", anchor: "#execute" },
  { id: "imports", label: "Imports", anchor: "#imports" },
  { id: "exports", label: "Exports", anchor: "#exports" },
  { id: "orders", label: "Orders", anchor: "#orders" },
  { id: "shipments", label: "Shipments", anchor: "#shipments" },
  { id: "po-suggestions", label: "PO Suggestions", anchor: "#po-suggestions" },
  { id: "exceptions", label: "Exceptions", anchor: "#exceptions" },
]

export function WorkbenchNav() {
  const [activeSection, setActiveSection] = useState<string>("kpi")
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/workbench") return

    const handleScroll = () => {
      const sections = navItems
        .map((item) => {
          const element = document.getElementById(item.id)
          if (element) {
            const rect = element.getBoundingClientRect()
            return { id: item.id, top: rect.top }
          }
          return null
        })
        .filter(Boolean) as Array<{ id: string; top: number }>

      // Find the section that's currently in view
      const currentSection = sections.find(
        (section) => section.top <= 100 && section.top >= -200
      )
      if (currentSection) {
        setActiveSection(currentSection.id)
      } else if (sections.length > 0) {
        // If scrolled to top, set first section as active
        const firstSection = sections[0]
        if (firstSection.top > 0) {
          setActiveSection(firstSection.id)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const handleClick = (anchor: string) => {
    const element = document.querySelector(anchor)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="px-6 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.anchor)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                activeSection === item.id
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

