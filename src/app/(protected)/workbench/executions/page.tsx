"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Play, 
  Sliders, 
  AlertTriangle, 
  Package, 
  DollarSign, 
  Ship, 
  FileText, 
  CheckSquare 
} from "lucide-react"

// Check feature flag safely without importing features module
function isWorkbenchEnabled(): boolean {
  try {
    const flag = process.env.NEXT_PUBLIC_FEATURE_WORKBENCH
    return flag !== '0' // Enabled by default unless explicitly disabled
  } catch {
    return false
  }
}

function ExecutionsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabFromQuery = searchParams.get('tab') || 'forecast'
  const [activeTab, setActiveTab] = useState(tabFromQuery)

  // Check feature flag
  const isEnabled = useMemo(() => isWorkbenchEnabled(), [])

  // Sync tab with query param
  useEffect(() => {
    const tab = searchParams.get('tab') || 'forecast'
    setActiveTab(tab)
  }, [searchParams])

  // Update query param when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/workbench/executions?tab=${value}`, { scroll: false })
  }

  // Gate workbench behind feature flag - check first before any imports
  if (!isEnabled) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Workbench Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              The Workbench feature is currently disabled. To enable it, set{" "}
              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                NEXT_PUBLIC_FEATURE_WORKBENCH=1
              </code>{" "}
              in your environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Only create dynamic imports when feature flag is on - inside component
  const tabs = useMemo(() => {
    if (!isEnabled) return null
    return {
      RunForecastTab: dynamic(() => import("@/features/workbench/RunForecastTab").then((mod) => ({ default: mod.RunForecastTab })), { ssr: false }),
      OverridesTab: dynamic(() => import("@/features/workbench/OverridesTab").then((mod) => ({ default: mod.OverridesTab })), { ssr: false }),
      ExceptionsTab: dynamic(() => import("@/features/workbench/ExceptionsTab").then((mod) => ({ default: mod.ExceptionsTab })), { ssr: false }),
      ReplenishmentTab: dynamic(() => import("@/features/workbench/ReplenishmentTab").then((mod) => ({ default: mod.ReplenishmentTab })), { ssr: false }),
      CostsTab: dynamic(() => import("@/features/workbench/CostsTab").then((mod) => ({ default: mod.CostsTab })), { ssr: false }),
      ShippingTab: dynamic(() => import("@/features/workbench/ShippingTab").then((mod) => ({ default: mod.ShippingTab })), { ssr: false }),
      DocsTab: dynamic(() => import("@/features/workbench/DocsTab").then((mod) => ({ default: mod.DocsTab })), { ssr: false }),
      TasksTab: dynamic(() => import("@/features/workbench/TasksTab").then((mod) => ({ default: mod.TasksTab })), { ssr: false }),
    }
  }, [isEnabled])

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        <div className="pt-2 md:pt-3">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <TabsTrigger 
            value="forecast" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <Play className="h-4 w-4 mr-2" />
            Forecast
          </TabsTrigger>
          <TabsTrigger 
            value="overrides"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <Sliders className="h-4 w-4 mr-2" />
            Overrides
          </TabsTrigger>
          <TabsTrigger 
            value="exceptions"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Exceptions
          </TabsTrigger>
          <TabsTrigger 
            value="replenishment"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <Package className="h-4 w-4 mr-2" />
            Replenish
          </TabsTrigger>
          <TabsTrigger 
            value="costs"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Costs
          </TabsTrigger>
          <TabsTrigger 
            value="shipping"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <Ship className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
          <TabsTrigger 
            value="docs"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <FileText className="h-4 w-4 mr-2" />
            Docs
          </TabsTrigger>
          <TabsTrigger 
            value="tasks"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
        </TabsList>

        {tabs && (
          <>
            <TabsContent value="forecast" className="mt-4">
              <tabs.RunForecastTab />
            </TabsContent>

            <TabsContent value="overrides" className="mt-4">
              <tabs.OverridesTab />
            </TabsContent>

            <TabsContent value="exceptions" className="mt-4">
              <tabs.ExceptionsTab />
            </TabsContent>

            <TabsContent value="replenishment" className="mt-4">
              <tabs.ReplenishmentTab />
            </TabsContent>

            <TabsContent value="costs" className="mt-4">
              <tabs.CostsTab />
            </TabsContent>

            <TabsContent value="shipping" className="mt-4">
              <tabs.ShippingTab />
            </TabsContent>

            <TabsContent value="docs" className="mt-4">
              <tabs.DocsTab />
            </TabsContent>

            <TabsContent value="tasks" className="mt-4">
              <tabs.TasksTab />
            </TabsContent>
          </>
        )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function ExecutionsPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    }>
      <ExecutionsContent />
    </Suspense>
  )
}
