"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Settings, User, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { railSections } from "@/config/nav"
import { useShellContext } from "./ShellContext"
import { useState, useEffect, useMemo } from "react"
import { isWorkbenchEnabled, isTimelineEnabled } from "@/lib/features"

function UserProfileButton() {
  const { user, isLoaded } = useUser()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      setIsDark(stored === "dark")
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      setIsDark(mq.matches)
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-900 rounded-full animate-pulse" />
    )
  }

  const primaryEmail = user?.emailAddresses?.[0]?.emailAddress
  const emailInitial = primaryEmail?.[0] || 'U'
  const initials = user?.firstName?.[0] + (user?.lastName?.[0] || emailInitial) || 'U'

  return (
    <Link
      href="/dashboard/settings/general"
      prefetch={false}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2"
      )}
      aria-label="Profile settings"
      title="Profile"
    >
      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-white">{initials}</span>
      </div>
    </Link>
  )
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      setIsDark(stored === "dark")
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      setIsDark(mq.matches)
    }
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const newTheme = !isDark
    setIsDark(newTheme)
    root.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
        "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
        "hover:bg-gray-100 dark:hover:bg-gray-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export function RailNav() {
  const pathname = usePathname()
  const { currentSection } = useShellContext()

  // Filter rail sections based on feature flags
  const visibleSections = useMemo(() => {
    return railSections.filter((section) => {
      if (section.id === 'workbench' && !isWorkbenchEnabled()) {
        return false
      }
      if (section.id === 'timelines' && !isTimelineEnabled()) {
        return false
      }
      return true
    })
  }, [])

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if focus is within the rail
      const rail = document.querySelector('[data-rail-nav]')
      if (!rail?.contains(document.activeElement)) return

      const currentIndex = visibleSections.findIndex(s => s.id === currentSection)
      let targetIndex = currentIndex

      if (event.key === "ArrowDown") {
        event.preventDefault()
        targetIndex = Math.min(currentIndex + 1, visibleSections.length - 1)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        targetIndex = Math.max(currentIndex - 1, 0)
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        const link = rail?.querySelector(`[data-rail-item="${currentSection}"]`) as HTMLAnchorElement
        link?.click()
        return
      }

      if (targetIndex !== currentIndex && targetIndex >= 0) {
        const targetSection = visibleSections[targetIndex]
        const link = rail?.querySelector(`[data-rail-item="${targetSection.id}"]`) as HTMLElement
        link?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSection, visibleSections])

  return (
    <nav
      data-rail-nav
      className={cn(
        "fixed left-0 top-0 h-screen w-[72px] flex flex-col",
        "bg-gray-50/95 dark:bg-black/95 backdrop-blur-sm",
        "border-r border-gray-200/60 dark:border-gray-800/60",
        "z-40"
      )}
    >
      {/* Top section - Main navigation */}
      <div className="flex-1 flex flex-col items-center py-4 gap-2">
        {visibleSections.map((section) => {
          const isActive = section.id === currentSection
          const Icon = section.icon

          return (
            <Link
              key={section.id}
              href={section.href}
              prefetch={false}
              data-rail-item={section.id}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                "text-gray-600 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-900",
                "hover:text-gray-900 dark:hover:text-white",
                isActive && "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2"
              )}
              aria-label={section.label}
              title={section.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </div>

      {/* Bottom section - Theme, Profile */}
      <div className="flex flex-col items-center py-4 gap-2 border-t border-gray-200/60 dark:border-gray-800/60">
        <ThemeToggle />
        <UserProfileButton />
      </div>
    </nav>
  )
}

