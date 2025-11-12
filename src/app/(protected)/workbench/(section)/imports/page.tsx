"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function ImportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Imports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload supplier, SKU, forecast, and shipment files
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Import Files</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload CSV, Excel, or JSON files to import data into the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-[#00FF7F] text-black hover:brightness-95">
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

