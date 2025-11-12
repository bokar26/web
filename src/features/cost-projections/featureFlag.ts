/**
 * Feature flag for Cost Projections V1
 * 
 * Defaults to enabled (true) - UI should be visible by default.
 * Can be disabled by setting NEXT_PUBLIC_FEATURE_COST_PROJECTIONS_V1='false' or '0'
 */
export function isCostProjectionsV1Enabled(): boolean {
  const envValue = process.env.NEXT_PUBLIC_FEATURE_COST_PROJECTIONS_V1
  // Default to enabled (true) - UI should be visible by default
  if (envValue === undefined) {
    return true
  }
  // Only disable if explicitly set to 'false' or '0'
  return envValue !== 'false' && envValue !== '0'
}

