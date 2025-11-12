import { NextResponse } from 'next/server'

/**
 * Health check endpoint
 * 
 * Returns 200 OK if the application is healthy, 503 if unhealthy.
 * Checks critical environment variables and basic functionality.
 * 
 * Usage:
 *   GET /_health
 * 
 * Response (200 OK):
 *   {
 *     "ok": true,
 *     "version": "dev" | "production",
 *     "timestamp": "2024-01-01T00:00:00.000Z",
 *     "checks": {
 *       "supabase": true,
 *       "clerk": true
 *     }
 *   }
 * 
 * Response (503 Service Unavailable):
 *   {
 *     "ok": false,
 *     "version": "dev",
 *     "timestamp": "2024-01-01T00:00:00.000Z",
 *     "checks": {
 *       "supabase": false,
 *       "clerk": false
 *     },
 *     "errors": ["Missing NEXT_PUBLIC_SUPABASE_URL", ...]
 *   }
 */
export async function GET() {
  const timestamp = new Date().toISOString()
  const version = process.env.NODE_ENV === 'production' ? 'production' : 'dev'
  const errors: string[] = []
  const checks: Record<string, boolean> = {}

  // Check Supabase environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseHealthy = !!(supabaseUrl && supabaseAnonKey)
  checks.supabase = supabaseHealthy

  if (!supabaseHealthy) {
    if (!supabaseUrl) errors.push('Missing NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseAnonKey) errors.push('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  // Check Clerk environment variables
  const clerkPublishableKey = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
    process.env.CLERK_PUBLISHABLE_KEY
  const clerkSecretKey = process.env.CLERK_SECRET_KEY
  const clerkHealthy = !!(clerkPublishableKey && clerkSecretKey)
  checks.clerk = clerkHealthy

  if (!clerkHealthy) {
    if (!clerkPublishableKey) {
      errors.push('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_PUBLISHABLE_KEY')
    }
    if (!clerkSecretKey) {
      errors.push('Missing CLERK_SECRET_KEY')
    }
  }

  // Determine overall health
  const isHealthy = supabaseHealthy && clerkHealthy

  const response = {
    ok: isHealthy,
    version,
    timestamp,
    checks,
    ...(errors.length > 0 && { errors }),
  }

  return NextResponse.json(response, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}

