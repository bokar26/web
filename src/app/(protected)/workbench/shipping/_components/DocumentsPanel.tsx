"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Download } from "lucide-react"

// Mock data - replace with actual Supabase query
const mockDocuments = [
  {
    id: "DOC-001",
    shipmentId: "SHIP-001",
    type: "BOL",
    fileName: "BOL_SHIP-001.pdf",
    uploadedAt: "2024-01-15 10:30 AM",
    status: "uploaded",
  },
  {
    id: "DOC-002",
    shipmentId: "SHIP-001",
    type: "Invoice",
    fileName: "Invoice_SHIP-001.pdf",
    uploadedAt: "2024-01-15 11:00 AM",
    status: "uploaded",
  },
]

export function DocumentsPanel() {
  const [documents] = useState(mockDocuments)

  const getDocTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary"> = {
      BOL: "default",
      Invoice: "secondary",
      "Packing List": "default",
    }
    return <Badge variant={variants[type] || "secondary"}>{type}</Badge>
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white">Documents</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage shipment documents (BOL, Invoice, Packing List)
            </CardDescription>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-white">Document Type</TableHead>
              <TableHead className="text-gray-900 dark:text-white">File Name</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Uploaded</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{getDocTypeBadge(doc.type)}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {doc.fileName}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {doc.uploadedAt}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{doc.status}</Badge>
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
                  No documents uploaded
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

