"use client"

import { createContext, useContext, useMemo, ReactNode } from "react"
import { usePathname } from "next/navigation"
import { getRailSections, type RailSection, type NavVariant } from "@/config/nav"

interface ShellContextType {
  currentSection: RailSection
  pathname: string
  navVariant: NavVariant
}

const ShellContext = createContext<ShellContextType | undefined>(undefined)

export function ShellProvider({ 
  children, 
  navVariant = "default" 
}: { 
  children: ReactNode
  navVariant?: NavVariant
}) {
  const pathname = usePathname()
  const railSections = getRailSections(navVariant)

  const currentSection = useMemo<RailSection>(() => {
    for (const section of railSections) {
      if (section.match(pathname)) {
        return section.id
      }
    }
    // Fallback based on variant
    if (navVariant === "admin") {
      return "injest"
    }
    return "home"
  }, [pathname, navVariant, railSections])

  return (
    <ShellContext.Provider value={{ currentSection, pathname, navVariant }}>
      {children}
    </ShellContext.Provider>
  )
}

export function useShellContext() {
  const context = useContext(ShellContext)
  if (context === undefined) {
    throw new Error("useShellContext must be used within a ShellProvider")
  }
  return context
}

