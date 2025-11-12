"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Users, Store } from "lucide-react"
import { CustomersTable } from "./CustomersTable"
import { VendorsTable } from "./VendorsTable"

export function ContactsTabs() {
  const [activeTab, setActiveTab] = useState("customers")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="customers" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Customers
        </TabsTrigger>
        <TabsTrigger value="vendors" className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          Vendors
        </TabsTrigger>
      </TabsList>
      <TabsContent value="customers" className="mt-6">
        <CustomersTable />
      </TabsContent>
      <TabsContent value="vendors" className="mt-6">
        <VendorsTable />
      </TabsContent>
    </Tabs>
  )
}

