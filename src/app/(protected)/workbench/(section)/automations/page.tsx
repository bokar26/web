"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function AutomationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Automations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage scheduled tasks and automated workflows
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Scheduled Tasks</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure and monitor automated processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">No automations configured</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Create your first scheduled task to get started</p>
              </div>
              <Badge variant="outline" className="text-gray-600 dark:text-gray-400">Inactive</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

