/**
 * Feature flag for Demand Forecast Execution
 */

export function isDemandExecEnabled(): boolean {
  const envValue = process.env.NEXT_PUBLIC_FEATURE_DEMAND_EXEC
  // Default to enabled in development, disabled in production
  if (envValue === undefined) {
    return process.env.NODE_ENV === 'development'
  }
  return envValue === 'true' || envValue === '1'
}

