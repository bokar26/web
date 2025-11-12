"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Cloud, HardDrive, Webhook } from "lucide-react"

const integrations = [
  { id: 'supabase', name: 'Supabase', icon: Database, description: 'Database and authentication' },
  { id: 's3', name: 'Amazon S3', icon: Cloud, description: 'File storage and backups' },
  { id: 'gdrive', name: 'Google Drive', icon: HardDrive, description: 'Document storage and sync' },
  { id: 'webhooks', name: 'Webhooks', icon: Webhook, description: 'Custom integrations and notifications' },
]

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Integrations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect external services and manage integrations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon
          return (
            <Card key={integration.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">{integration.name}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">{integration.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button disabled variant="outline" className="w-full text-gray-600 dark:text-gray-400">
                  Connect
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

