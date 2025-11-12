"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Store } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ContactsPage() {
  const router = useRouter()

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
            {/* Navigation Tabs */}
            <div className="pt-2 md:pt-3">
              <Tabs defaultValue="vendors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="vendors"
                onClick={() => router.push("/workbench/contacts/vendors")}
                className="flex items-center gap-2"
              >
                <Store className="h-4 w-4" />
                Vendors
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                onClick={() => router.push("/workbench/contacts/customers")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Customers
              </TabsTrigger>
            </TabsList>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                onClick={() => router.push("/workbench/contacts/vendors")}
              >
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Vendors
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    View and manage saved vendors from suppliers, warehouses, and logistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push("/workbench/contacts/vendors")
                    }}
                  >
                    View Vendors
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                onClick={() => router.push("/workbench/contacts/customers")}
              >
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customers
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Manage customer relationships and track performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push("/workbench/contacts/customers")
                    }}
                  >
                    View Customers
                  </Button>
                </CardContent>
              </Card>
            </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

