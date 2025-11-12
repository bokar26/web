"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ExportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Exports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and download generated export files
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Generated Exports</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            List of all exported files and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">File Name</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Type</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Created</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-gray-600 dark:text-gray-400">No exports yet</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">-</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">-</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

