"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VendorCountBar } from "./_components/VendorCountBar"
import { ManualEntryTable } from "./_components/ManualEntryTable"
import { BulkUploadForm } from "./_components/BulkUploadForm"

export default function InjestPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleVendorCreated = () => {
    // Trigger refresh of vendor count
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        <div className="pt-2 md:pt-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Injest
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up a sequence to upload new vendors
            </p>
          </div>

          {/* Vendor Count Bar */}
          <div className="mt-6">
            <VendorCountBar refreshTrigger={refreshTrigger} />
          </div>

          {/* Tabs for Manual Entry and Bulk Upload */}
          <Tabs defaultValue="manual" className="w-full mt-6">
            <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <TabsTrigger 
                value="manual"
                className="data-[state=active]:bg-[#00FF7F] data-[state=active]:text-black"
              >
                Manual Entry
              </TabsTrigger>
              <TabsTrigger 
                value="bulk"
                className="data-[state=active]:bg-[#00FF7F] data-[state=active]:text-black"
              >
                Bulk Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              <ManualEntryTable onSuccess={handleVendorCreated} />
            </TabsContent>

            <TabsContent value="bulk" className="mt-6">
              <BulkUploadForm onSuccess={handleVendorCreated} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
