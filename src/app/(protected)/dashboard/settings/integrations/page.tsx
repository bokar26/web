"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Cloud, HardDrive, Webhook, Plug } from "lucide-react"

const integrations = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Connect to your Supabase project for database access.",
    icon: Database,
    status: "Connected",
  },
  {
    id: "s3",
    name: "Amazon S3",
    description: "Store and retrieve files from Amazon S3 buckets.",
    icon: Cloud,
    status: "Disconnected",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Integrate with Google Drive for document management.",
    icon: HardDrive,
    status: "Disconnected",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Set up webhooks to trigger external services.",
    icon: Webhook,
    status: "Connected",
  },
]

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Integrations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with external services and platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon
          const isConnected = integration.status === "Connected"
          return (
            <Card
              key={integration.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                  {integration.name}
                </CardTitle>
                <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                  {integration.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isConnected
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {integration.status}
                  </span>
                  <Button variant="outline" size="sm" disabled={isConnected}>
                    {isConnected ? "Manage" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
