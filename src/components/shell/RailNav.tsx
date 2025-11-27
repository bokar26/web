"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUser, SignOutButton } from "@clerk/nextjs"
import { Settings, Sun, Moon, HelpCircle, LifeBuoy, Shield, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { getRailSections } from "@/config/nav"
import { useShellContext } from "./ShellContext"
import { useState, useEffect, useMemo } from "react"
import { isWorkbenchEnabled, isTimelineEnabled } from "@/lib/features"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function UserProfileButton() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
  const displayName = user?.firstName || primaryEmail?.split('@')[0] || 'User'
  const role = "User" // Fallback role text

  const handleNavigation = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
            "hover:bg-gray-100 dark:hover:bg-gray-900",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2"
          )}
          aria-label="Profile menu"
          title="Profile"
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">{initials}</span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {displayName}
              </SheetTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{role}</p>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col px-4 pb-4 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-left"
            onClick={() => handleNavigation("/dashboard/settings/general")}
          >
            <Settings className="h-5 w-5" />
            <span>Account Settings</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-left"
            onClick={() => handleNavigation("/support/help")}
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-left"
            onClick={() => handleNavigation("/support/contact")}
          >
            <LifeBuoy className="h-5 w-5" />
            <span>Support</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-left"
            onClick={() => handleNavigation("/admin/injest")}
          >
            <Shield className="h-5 w-5" />
            <span>Admin View</span>
          </Button>
          
          <Separator className="my-2" />
          
          <SignOutButton>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </SignOutButton>
        </div>
      </SheetContent>
    </Sheet>
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
  const { currentSection, navVariant } = useShellContext()
  const railSections = getRailSections(navVariant)

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
  }, [railSections])

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

