"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function ImportsPage() {
  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        <div className="pt-2 md:pt-3">
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
      </div>
    </div>
  )
}
