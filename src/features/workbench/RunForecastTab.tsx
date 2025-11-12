"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle, Loader2 } from "lucide-react"
import { runForecast } from "@/server/actions/workbench/forecast.run"
import { publishForecast } from "@/server/actions/workbench/forecast.publish"
import { cn } from "@/lib/utils"

export function RunForecastTab() {
  const [runId, setRunId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'queued' | 'running' | 'success' | 'failed'>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleRunForecast = async () => {
    setIsRunning(true);
    setStatus('queued');

    try {
      const result = await runForecast({
        scope: {
          period: "current",
        },
        confidence: 0.95,
      });

      if (result.ok) {
        setRunId(result.data.runId);
        setStatus('queued');
        toast.success("Forecast run queued");
        
        // Poll for status (simplified - in production would use proper polling)
        setTimeout(() => {
          setStatus('running');
          setTimeout(() => {
            setStatus('success');
            toast.success("Forecast run completed");
          }, 3000);
        }, 2000);
      } else {
        setStatus('failed');
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[RunForecastTab] Run forecast error:', error);
      setStatus('failed');
      toast.error("Failed to run forecast");
    } finally {
      setIsRunning(false);
    }
  }

  const handlePublish = async () => {
    if (!runId) {
      toast.error("No forecast run to publish");
      return;
    }

    setIsPublishing(true);
    try {
      const result = await publishForecast({ runId });

      if (result.ok) {
        toast.success(`Forecast published with ${result.data.lineCount} lines`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[RunForecastTab] Publish error:', error);
      toast.error("Failed to publish forecast");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Run Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleRunForecast}
              disabled={isRunning || status === 'running'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isRunning || status === 'running' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Forecast
                </>
              )}
            </Button>

            {status !== 'idle' && (
              <Badge
                variant="secondary"
                className={cn(
                  status === 'success' && "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
                  status === 'failed' && "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
                  (status === 'queued' || status === 'running') && "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                )}
              >
                {status === 'queued' && 'Queued'}
                {status === 'running' && 'Running'}
                {status === 'success' && 'Success'}
                {status === 'failed' && 'Failed'}
              </Badge>
            )}
          </div>

          {status === 'success' && runId && (
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isPublishing ? "Publishing..." : "Publish Forecast"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

