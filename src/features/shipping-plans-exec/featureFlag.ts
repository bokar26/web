/**
 * Feature flag for Shipping Plans Execution feature
 * 
 * Default behavior:
 * - ON in development (unless explicitly set to '0')
 * - OFF in production (unless explicitly set to '1')
 */

export function isShippingPlansExecEnabled(): boolean {
  const envValue = process.env.NEXT_PUBLIC_FEATURE_SHIPPING_EXEC
  
  // Explicitly enabled
  if (envValue === '1') {
    return true
  }
  
  // Explicitly disabled
  if (envValue === '0') {
    return false
  }
  
  // Default: enabled in development, disabled in production
  return process.env.NODE_ENV === 'development'
}

export const shippingPlansExecEnabled = isShippingPlansExecEnabled()

