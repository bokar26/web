"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Enhanced structured error logging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      componentStack: (error as any).componentStack,
    }

    // Log structured error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error("[GlobalError] Critical error caught:", errorDetails)
      console.error("[GlobalError] Full error object:", error)
    } else {
      // Production: log structured JSON for monitoring
      console.error("[GlobalError]", JSON.stringify(errorDetails))
    }

    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { level: 'fatal' })
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-black min-h-screen flex items-center justify-center p-6">
        <Card className="dashboard-card max-w-2xl w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <CardTitle className="text-white">Critical Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              A critical error occurred that prevented the application from loading. Please try reloading the page.
            </p>
            
            {/* Error details in development */}
            {isDevelopment && (
              <div className="space-y-3">
                {error.message && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-sm font-semibold text-red-400 mb-1">Error Message:</p>
                    <p className="text-sm text-red-300 font-mono break-all">
                      {error.message}
                    </p>
                  </div>
                )}
                {error.stack && (
                  <details className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                    <summary className="cursor-pointer text-red-400 hover:text-red-300 text-sm font-semibold">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-auto max-h-60 text-gray-400">
                      {error.stack}
                    </pre>
                  </details>
                )}
                {(error as any).componentStack && (
                  <details className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                    <summary className="cursor-pointer text-red-400 hover:text-red-300 text-sm font-semibold">
                      Component Stack
                    </summary>
                    <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-auto max-h-60 text-gray-400">
                      {(error as any).componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Error ID in production */}
            {!isDevelopment && error.digest && (
              <p className="text-xs text-gray-500">
                Error ID: <code className="text-gray-400">{error.digest}</code>
              </p>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  window.location.reload()
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </body>
    </html>
  )
}

