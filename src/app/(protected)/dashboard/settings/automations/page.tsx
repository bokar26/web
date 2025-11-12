"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, PlusCircle, ListChecks } from "lucide-react"

export default function AutomationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Automations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage scheduled tasks and automated workflows
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Scheduled Tasks</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure and monitor automated processes
              </CardDescription>
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <ListChecks className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Daily Forecast Run</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Runs every day at 02:00 AM UTC</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Weekly Inventory Report</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generates every Monday at 09:00 AM UTC</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 dark:text-blue-400">
                Scheduled
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">No automations configured</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Create your first scheduled task to get started</p>
                </div>
              </div>
              <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                Inactive
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

