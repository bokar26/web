"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data - replace with actual Supabase query
const mockExports = [
  {
    id: "1",
    fileName: "suppliers_export_2024-01-15.csv",
    type: "CSV",
    created: "2024-01-15 10:30 AM",
    status: "completed",
  },
  {
    id: "2",
    fileName: "forecast_report_2024-01-14.xlsx",
    type: "Excel",
    created: "2024-01-14 02:15 PM",
    status: "completed",
  },
]

export function ExportsPanel() {
  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Generated Exports</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                List of all exported files and reports
              </CardDescription>
            </div>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              New Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">File Name</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Type</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Created</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                <TableHead className="text-gray-900 dark:text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExports.length > 0 ? (
                mockExports.map((exportItem) => (
                  <TableRow key={exportItem.id}>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {exportItem.fileName}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {exportItem.type}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {exportItem.created}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          exportItem.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {exportItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-600 dark:text-gray-400">
                    No exports yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

