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
    // Log error to console (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">500</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Something went wrong</h2>
        <p className="text-lg text-gray-300 mb-8">
          An unexpected error occurred. Please try again.
        </p>
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

