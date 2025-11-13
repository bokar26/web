"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AccountingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Accounting] Error:", error)
    console.error("[Accounting] Stack:", error.stack)
  }, [error])

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-red-500 dark:border-red-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-gray-900 dark:text-white">
              Accounting Error
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              Error ID: {error.digest}
            </p>
          )}
          <Button onClick={reset} className="w-full bg-[#00FF7F] text-black hover:brightness-95">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

