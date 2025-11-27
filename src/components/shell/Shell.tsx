"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { RailNav } from "./RailNav"
import { ContextNav } from "./ContextNav"
import { ContextNavMobile } from "./ContextNavMobile"
import { Breadcrumbs } from "./Breadcrumbs"
import { ShellProvider } from "./ShellContext"
import { cn } from "@/lib/utils"
import type { NavVariant } from "@/config/nav"

interface ShellProps {
  children: React.ReactNode
  navVariant?: NavVariant
}

export function Shell({ children, navVariant = "default" }: ShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <ShellProvider navVariant={navVariant}>
      <div className="flex h-screen bg-background">
        {/* Icon Rail - Always visible */}
        <RailNav />

        {/* Context Sidebar - Desktop only */}
        <ContextNav />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto ml-[72px] md:ml-[352px] transition-all duration-150 ease-out bg-background">
          {/* Mobile menu button - only visible on small screens */}
          <div className="md:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-800/60 p-2">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <ContextNavMobile onNavigate={() => setMobileNavOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Page Content */}
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </ShellProvider>
  )
}

