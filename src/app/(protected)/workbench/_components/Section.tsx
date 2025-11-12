"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  title: string
  subtitle?: string
  toolbar?: ReactNode
  id?: string
  className?: string
  children: ReactNode
}

export function Section({
  title,
  subtitle,
  toolbar,
  id,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {toolbar && <div>{toolbar}</div>}
      </div>
      {children}
    </section>
  )
}

