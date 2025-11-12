"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { listExceptions } from "@/server/actions/workbench/exceptions.list"
import { resolveException } from "@/server/actions/workbench/exceptions.resolve"
import { cn } from "@/lib/utils"

export function ExceptionsTab() {
  const [exceptions, setExceptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExceptions()
  }, [])

  const loadExceptions = async () => {
    setLoading(true);
    try {
      const result = await listExceptions({ status: 'open' });
      if (result.ok) {
        setExceptions(result.data.exceptions);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[ExceptionsTab] Load exceptions error:', error);
      toast.error("Failed to load exceptions");
    } finally {
      setLoading(false);
    }
  }

  const handleResolve = async (exceptionId: string, exceptionType: 'forecast' | 'general') => {
    try {
      const result = await resolveException({
        exceptionId,
        exceptionType,
        resolutionNote: "Resolved from Workbench",
      });

      if (result.ok) {
        toast.success("Exception resolved");
        loadExceptions();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[ExceptionsTab] Resolve error:', error);
      toast.error("Failed to resolve exception");
    }
  }

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading exceptions...</div>
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Exceptions</CardTitle>
        </CardHeader>
        <CardContent>
          {exceptions.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 py-8 text-center">
              No open exceptions
            </div>
          ) : (
            <div className="space-y-2">
              {exceptions.map((exception) => (
                <div
                  key={exception.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={cn(
                        "h-5 w-5",
                        exception.severity === 'high' && "text-red-500",
                        exception.severity === 'medium' && "text-amber-500",
                        exception.severity === 'low' && "text-blue-500"
                      )}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {exception.type}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {exception.skuId && `SKU: ${exception.skuId}`}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        exception.severity === 'high' && "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
                        exception.severity === 'medium' && "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
                        exception.severity === 'low' && "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      )}
                    >
                      {exception.severity}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(exception.id, exception.type === 'forecast' ? 'forecast' : 'general')}
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

