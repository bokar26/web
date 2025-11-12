/**
 * Environment variable validation utilities
 * 
 * Provides functions to validate required environment variables
 * and return user-friendly error messages if missing.
 */

export interface EnvValidationResult {
  valid: boolean
  missing: string[]
  errors: string[]
}

/**
 * Validate required environment variables
 * 
 * @param required - Array of required env var names
 * @returns Validation result with missing vars and error messages
 */
export function validateEnv(required: string[]): EnvValidationResult {
  const missing: string[] = []
  const errors: string[] = []

  for (const varName of required) {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      missing.push(varName)
      errors.push(`Missing required environment variable: ${varName}`)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    errors,
  }
}

/**
 * Validate critical environment variables for the application
 * 
 * @returns Validation result for Supabase and Clerk vars
 */
export function validateCriticalEnv(): EnvValidationResult {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  // Clerk can use either NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_PUBLISHABLE_KEY
  const clerkKey = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
    process.env.CLERK_PUBLISHABLE_KEY

  const result = validateEnv(required)
  
  if (!clerkKey || clerkKey.trim() === '') {
    result.missing.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_PUBLISHABLE_KEY')
    result.errors.push('Missing Clerk publishable key (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_PUBLISHABLE_KEY)')
    result.valid = false
  }

  return result
}

/**
 * Get a user-friendly error message for missing environment variables
 * 
 * @param validation - Validation result from validateEnv or validateCriticalEnv
 * @returns Formatted error message
 */
export function getEnvErrorMessage(validation: EnvValidationResult): string {
  if (validation.valid) {
    return ''
  }

  const missingList = validation.missing.map(v => `  - ${v}`).join('\n')
  return `Missing required environment variables:\n${missingList}\n\nPlease check your .env.local file and ensure all required variables are set.`
}

/**
 * Assert that required environment variables are present
 * Throws an error with a helpful message if any are missing
 * 
 * @param required - Array of required env var names
 * @throws Error if any required vars are missing
 */
export function assertEnv(required: string[]): void {
  const validation = validateEnv(required)
  if (!validation.valid) {
    const message = getEnvErrorMessage(validation)
    throw new Error(message)
  }
}

