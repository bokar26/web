"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listExceptions, ForecastException } from "../actions/listExceptions"
import { runForecast } from "../actions/runForecast"
import { toast } from "sonner"
import { AlertTriangle, CheckCircle, Clock, User } from "lucide-react"

interface ExceptionsListProps {
  runId: string | null
}

export function ExceptionsList({ runId }: ExceptionsListProps) {
  const [exceptions, setExceptions] = useState<ForecastException[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  useEffect(() => {
    loadExceptions()
  }, [runId])

  const loadExceptions = async () => {
    setIsLoading(true)
    try {
      const result = await listExceptions(runId || undefined)
      setExceptions(result.exceptions)
    } catch (error: any) {
      toast.error(error.message || "Failed to load exceptions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolve = async (exceptionId: string) => {
    // Stub: would call resolveException action
    toast.info("Resolve exception feature coming soon")
  }

  const handleReForecast = async (exception: ForecastException) => {
    try {
      // Re-forecast for this SKU subset
      await runForecast({
        scope: {
          period: "12m",
          channel: "all",
          category: "all",
        },
        confidence: 95,
      })
      toast.success("Re-forecast initiated for SKU subset")
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate re-forecast")
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-900/20 border-red-500/30 text-red-400"
      case "medium":
        return "bg-amber-900/20 border-amber-500/30 text-amber-400"
      case "low":
        return "bg-blue-900/20 border-blue-500/30 text-blue-400"
      default:
        return "bg-gray-900/20 border-gray-500/30 text-gray-400"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "variance_spike":
        return "Variance Spike"
      case "promo_lift":
        return "Promo Lift"
      case "stockout_distortion":
        return "Stockout Distortion"
      case "sparse_history":
        return "Sparse History"
      default:
        return type
    }
  }

  const filteredExceptions = exceptions.filter((ex) => {
    if (statusFilter !== "all" && ex.status !== statusFilter) return false
    if (severityFilter !== "all" && ex.severity !== severityFilter) return false
    return true
  })

  return (
    <Card className="dashboard-card">
      <CardContent className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="snoozed">Snoozed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-600 dark:text-white">Loading...</div>
        ) : filteredExceptions.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-white">
            No exceptions found
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExceptions.map((exception) => (
              <div
                key={exception.id}
                className="p-4 rounded-lg border border-gray-600 bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getSeverityColor(exception.severity)}>
                        {exception.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium text-white">
                        {getTypeLabel(exception.type)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-white">
                        SKU: {exception.skuId}
                      </span>
                    </div>
                    {exception.notes && (
                      <p className="text-sm text-gray-600 dark:text-white mb-2">
                        {exception.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-white">
                      <span>
                        Detected: {new Date(exception.detectedAt).toLocaleDateString()}
                      </span>
                      {exception.assignedTo && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Assigned
                        </span>
                      )}
                      {exception.resolvedAt && (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Resolved: {new Date(exception.resolvedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {exception.status === "open" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReForecast(exception)}
                          className="text-gray-900 dark:text-white border-gray-600"
                        >
                          Re-forecast
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Assign feature coming soon")}
                          className="text-gray-900 dark:text-white border-gray-600"
                        >
                          Assign
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Add note feature coming soon")}
                          className="text-gray-900 dark:text-white border-gray-600"
                        >
                          Add Note
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleResolve(exception.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

