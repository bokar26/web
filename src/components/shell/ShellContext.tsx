"use client"

import { createContext, useContext, useMemo, ReactNode } from "react"
import { usePathname } from "next/navigation"
import { railSections, type RailSection } from "@/config/nav"

interface ShellContextType {
  currentSection: RailSection
  pathname: string
}

const ShellContext = createContext<ShellContextType | undefined>(undefined)

export function ShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const currentSection = useMemo<RailSection>(() => {
    for (const section of railSections) {
      if (section.match(pathname)) {
        return section.id
      }
    }
    // Fallback to home if no match
    return "home"
  }, [pathname])

  return (
    <ShellContext.Provider value={{ currentSection, pathname }}>
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

