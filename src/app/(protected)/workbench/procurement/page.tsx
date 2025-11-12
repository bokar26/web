"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Warehouse, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProcurementPage() {
  const router = useRouter()

  const handleNavigation = (route: string) => {
    router.push(route)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
            {/* Quick Navigation Cards */}
            <div className="pt-2 md:pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              onClick={() => handleNavigation("/workbench/procurement/suppliers")}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Suppliers
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Find and compare suppliers and manufacturing partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("/workbench/procurement/suppliers")
                  }}
                >
                  Search Suppliers
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              onClick={() => handleNavigation("/workbench/procurement/warehouses")}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Warehouse className="h-5 w-5" />
                  Warehouses
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Locate storage and fulfillment facilities worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("/workbench/procurement/warehouses")
                  }}
                >
                  Search Warehouses
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              onClick={() => handleNavigation("/workbench/procurement/logistics")}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Logistics
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Connect with freight forwarders, carriers, and shipping partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("/workbench/procurement/logistics")
                  }}
                >
                  Search Logistics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Note */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Click on any card above to navigate to the search page. Procurement search functionality
                is available at the dedicated search pages.
              </p>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
