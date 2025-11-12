"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Wrench, FileText, Settings, Plug } from "lucide-react"

const workbenchSections = [
  { id: 'executions', label: 'Executions', href: '/workbench/executions', icon: Wrench },
  { id: 'imports', label: 'Imports', href: '/workbench/imports', icon: FileText },
  { id: 'exports', label: 'Exports', href: '/workbench/exports', icon: FileText },
  { id: 'automations', label: 'Automations', href: '/workbench/automations', icon: Settings },
  { id: 'integrations', label: 'Integrations', href: '/workbench/integrations', icon: Plug },
  { id: 'logs', label: 'Logs', href: '/workbench/logs', icon: FileText },
] as const

export function WorkbenchNav() {
  const pathname = usePathname()
  
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
      <div className="px-6 py-3">
        <div className="flex items-center gap-1">
          {workbenchSections.map((section) => {
            const isActive = pathname === section.href || pathname.startsWith(section.href + '/')
            const Icon = section.icon
            
            return (
              <Link
                key={section.id}
                href={section.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-900",
                  isActive
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

