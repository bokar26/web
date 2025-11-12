"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CostDriver {
  driver: string
  impact: number
  confidence: number
}

interface CostDriversPanelProps {
  costDrivers: CostDriver[]
}

export function CostDriversPanel({ costDrivers }: CostDriversPanelProps) {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="dashboard-card-title">Cost Driver Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costDrivers.map((driver, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{driver.driver}</h3>
                <span className="text-sm font-medium text-gray-600 dark:text-white">
                  {driver.confidence}% confidence
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-4">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(driver.impact * 2, 100)}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  driver.impact >= 10 ? 'text-red-600 dark:text-red-400' :
                  driver.impact >= 5 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {driver.impact}% impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

