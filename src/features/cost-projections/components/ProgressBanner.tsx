"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ProgressBannerProps {
  runStatus: 'queued' | 'running'
  isRunning: boolean
}

export function ProgressBanner({ runStatus, isRunning }: ProgressBannerProps) {
  if (!isRunning || (runStatus !== 'queued' && runStatus !== 'running')) {
    return null
  }

  return (
    <Card className="dashboard-card mb-4 border-blue-500/30 bg-blue-900/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-white">
            Projections {runStatus === 'queued' ? 'queued' : 'running'}... Please wait.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

