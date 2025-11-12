"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Filter } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual Supabase query
const mockLogs = [
  {
    id: "LOG-001",
    timestamp: "2024-01-15 10:30 AM",
    actor: "user@example.com",
    action: "po_create",
    entityType: "PO",
    entityId: "PO-123",
    description: "Purchase order created",
  },
  {
    id: "LOG-002",
    timestamp: "2024-01-15 09:15 AM",
    actor: "system",
    action: "forecast_run",
    entityType: "Forecast",
    entityId: "FC-456",
    description: "Forecast generation completed",
  },
  {
    id: "LOG-003",
    timestamp: "2024-01-14 03:45 PM",
    actor: "user@example.com",
    action: "shipment_booked",
    entityType: "Shipment",
    entityId: "SHIP-789",
    description: "Shipment booked with carrier",
  },
]

function LogsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState("7d")
  const [actorFilter, setActorFilter] = useState<string>("all")
  const [entityFilter, setEntityFilter] = useState<string>("all")

  const handleRowClick = (log: typeof mockLogs[0]) => {
    // Deep link to workbench with query param
    let anchor = ""
    let openParam = ""

    switch (log.entityType) {
      case "PO":
        anchor = "#po-suggestions"
        openParam = `po:${log.entityId}`
        break
      case "Shipment":
        anchor = "#shipments"
        openParam = `shipment:${log.entityId}`
        break
      case "Exception":
        anchor = "#exceptions"
        openParam = `exception:${log.entityId}`
        break
      case "Forecast":
        anchor = "#execute"
        break
      default:
        anchor = "#execute"
    }

    router.push(`/workbench${anchor}${openParam ? `?open=${openParam}` : ""}`)
  }

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      po_create: "default",
      forecast_run: "secondary",
      shipment_booked: "default",
      exception_resolved: "default",
    }
    return (
      <Badge variant={variants[action] || "secondary"}>{action}</Badge>
    )
  }

  const filteredLogs = mockLogs.filter((log) => {
    if (actorFilter !== "all" && log.actor !== actorFilter) return false
    if (entityFilter !== "all" && log.entityType !== entityFilter) return false
    return true
  })

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View chronological activity feed and audit logs
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Date Range
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Actor
              </label>
              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="user@example.com">user@example.com</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Entity Type
              </label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PO">Purchase Order</SelectItem>
                  <SelectItem value="Order">Order</SelectItem>
                  <SelectItem value="Shipment">Shipment</SelectItem>
                  <SelectItem value="Forecast">Forecast</SelectItem>
                  <SelectItem value="Import/Export">Import/Export</SelectItem>
                  <SelectItem value="Exception">Exception</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Activity Logs</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Click on a row to view details in Workbench
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">Timestamp</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Actor</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Action</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Entity Type</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Entity ID</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                    onClick={() => handleRowClick(log)}
                  >
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {log.actor}
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {log.entityType}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {log.entityId}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {log.description}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-600 dark:text-gray-400">
                    No logs found
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

export default function LogsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      }
    >
      <LogsContent />
    </Suspense>
  )
}

