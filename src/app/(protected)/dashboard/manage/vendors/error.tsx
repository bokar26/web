'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function VendorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error with detailed information
    console.error('[vendors/error] Error boundary caught error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
    })
  }, [error])

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-black">
      <Card className="dashboard-card max-w-2xl mx-auto mt-12 border-red-500">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Something went wrong
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 mb-4">
            {error.message || 'An unexpected error occurred while loading vendors.'}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard/manage/vendors'}
              variant="outline"
              className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-800"
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

