'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Enhanced error logging for debugging with component stack
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      componentStack: (error as any).componentStack || (error as any).reactErrorInfo?.componentStack || 'N/A',
    }

    // Log to console (always in development, errors in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Boundary] Application error:', errorDetails)
      console.error('[Error Boundary] Full error object:', error)
      if (errorDetails.componentStack && errorDetails.componentStack !== 'N/A') {
        console.error('[Error Boundary] Component Stack:', errorDetails.componentStack)
      }
    } else {
      // In production, log structured error for monitoring
      console.error('[Error Boundary]', JSON.stringify(errorDetails))
    }

    // In development, also log to server (if available)
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Could send to error tracking service here
      // Example: Sentry.captureException(error)
    }
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">500</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Something went wrong</h2>
        <p className="text-lg text-gray-300 mb-8">
          An unexpected error occurred. Please try again.
        </p>

        {/* Error details in development */}
        {isDevelopment && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left max-w-2xl mx-auto">
            <h3 className="text-red-400 font-semibold mb-2">Error Details (Development Only)</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Message:</strong> {error.message}</p>
              {error.digest && (
                <p><strong>Error ID:</strong> <code className="text-red-300">{error.digest}</code></p>
              )}
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-400 hover:text-red-300">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-auto max-h-60 text-gray-400">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Error ID in production */}
        {!isDevelopment && error.digest && (
          <p className="text-sm text-gray-500 mb-8">
            Error ID: <code className="text-gray-400">{error.digest}</code>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-block bg-[#00FF7F] text-black px-8 py-3 rounded-lg font-semibold hover:brightness-95 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block bg-transparent border-2 border-[#00FF7F] text-[#00FF7F] px-8 py-3 rounded-lg font-semibold hover:bg-[#00FF7F] hover:text-black transition-all"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

