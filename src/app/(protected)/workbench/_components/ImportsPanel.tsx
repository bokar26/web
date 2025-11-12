"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function ImportsPanel() {
  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Import Files</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload CSV, Excel, or JSON files to import data into the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop files here or click to browse
              </p>
              <Button className="bg-[#00FF7F] text-black hover:brightness-95">
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">Supported file types:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>CSV files for suppliers, SKUs, forecasts, and shipments</li>
                <li>Excel files (.xlsx, .xls)</li>
                <li>JSON files for structured data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

