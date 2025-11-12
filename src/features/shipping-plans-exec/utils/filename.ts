/**
 * SSR-safe filename generation helper
 * Uses Date.now() and Math.random() - no browser APIs
 */

/**
 * Generate a safe filename with prefix and suffix
 * Format: {prefix}_{uniqueId}_{suffix}
 */
export function makeSafeFilename(prefix: string, suffix: string): string {
  // Guard against empty/invalid inputs
  const safePrefix = (prefix || 'file').replace(/[^a-zA-Z0-9_-]/g, '_')
  const safeSuffix = (suffix || 'txt').replace(/[^a-zA-Z0-9_.-]/g, '_')
  
  // Generate unique ID using SSR-safe methods
  const uniqueId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  
  return `${safePrefix}_${uniqueId}_${safeSuffix}`
}

