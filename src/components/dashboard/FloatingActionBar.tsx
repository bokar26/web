"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface FloatingAction {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  disabled?: boolean
  tooltip?: string
}

interface FloatingActionBarProps {
  actions: FloatingAction[]
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
}

export function FloatingActionBar({ actions, position = 'bottom-right' }: FloatingActionBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      setIsVisible(scrollY > 200) // Show after scrolling 200px
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible || actions.length === 0) {
    return null
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  const finalPosition = isMobile ? 'bottom-center' : position

  return (
    <div
      className={`fixed ${positionClasses[finalPosition]} z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <Card className="dashboard-card shadow-lg">
        <CardContent className="p-2">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
            {actions.map((action, idx) => (
              <Button
                key={idx}
                size={isMobile ? 'sm' : 'default'}
                variant="outline"
                onClick={action.onClick}
                disabled={action.disabled}
                title={action.tooltip}
                aria-label={action.tooltip || action.label}
                className="text-xs"
              >
                {action.icon && <span className={isMobile ? '' : 'mr-2'}>{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

