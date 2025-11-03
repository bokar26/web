export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  EDGE_DEMO_INGEST_URL: process.env.NEXT_PUBLIC_EDGE_DEMO_INGEST_URL || '',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || 
    process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '',
  CAPTCHA_TYPE: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'turnstile' : 'hcaptcha'
} as const

/**
 * Dev-only diagnostic for Clerk environment variables.
 * Logs key prefix, length, format issues, and working directory.
 * Runs at module load (server-side) and can be called client-side.
 */
export function diagnoseClerkEnv() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const isServer = typeof window === 'undefined';
  const context = isServer ? 'Server' : 'Client';
  const cwd = isServer ? process.cwd() : 'N/A (browser)';
  
  const primaryKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const fallbackKey = process.env.CLERK_PUBLISHABLE_KEY;
  
  let keySource = 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY';
  let keyValue = primaryKey;
  
  if (!keyValue || keyValue.trim() === '') {
    keySource = 'CLERK_PUBLISHABLE_KEY';
    keyValue = fallbackKey;
  }
  
  if (!keyValue || keyValue.trim() === '') {
    console.warn(
      `[Clerk Env Diagnostic] ${context}: No publishable key found. Checked both NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_PUBLISHABLE_KEY.`
    );
    if (isServer) {
      console.warn(`[Clerk Env Diagnostic] ${context}: Working directory: ${cwd}`);
      console.warn(`[Clerk Env Diagnostic] ${context}: Expected .env.local at: ${cwd}/.env.local`);
    }
    return;
  }
  
  const trimmedKey = keyValue.trim();
  const hasTrailingWhitespace = trimmedKey !== keyValue;
  const hasQuotes = (keyValue.startsWith('"') && keyValue.endsWith('"')) || 
                    (keyValue.startsWith("'") && keyValue.endsWith("'"));
  const isValidPrefix = trimmedKey.startsWith('pk_test_') || trimmedKey.startsWith('pk_live_');
  const prefix = trimmedKey.substring(0, 6);
  const length = trimmedKey.length;
  
  console.log(
    `[Clerk Env Diagnostic] ${context}: ${keySource} = ${prefix}... (length: ${length})`
  );
  
  if (isServer) {
    console.log(`[Clerk Env Diagnostic] ${context}: Working directory: ${cwd}`);
  }
  
  if (hasTrailingWhitespace) {
    console.warn(
      `[Clerk Env Diagnostic] ${context}: ⚠️ Key has trailing whitespace. Trim your .env.local file.`
    );
  }
  
  if (hasQuotes) {
    console.warn(
      `[Clerk Env Diagnostic] ${context}: ⚠️ Key is wrapped in quotes. Remove quotes from .env.local (value should be: ${trimmedKey.substring(0, 10)}...)`
    );
  }
  
  if (!isValidPrefix) {
    console.warn(
      `[Clerk Env Diagnostic] ${context}: ⚠️ Key has invalid prefix "${prefix}". Expected "pk_test_" or "pk_live_".`
    );
  } else {
    console.log(
      `[Clerk Env Diagnostic] ${context}: ✓ Key format is valid`
    );
  }
}

// Run diagnostic at module load (server-side only)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  diagnoseClerkEnv();
}

// Export clean named constants for easy importing
export const EDGE_DEMO_URL = env.EDGE_DEMO_INGEST_URL
export const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
export const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY

/**
 * Resolves Clerk publishable key with fallback support.
 * Primary: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 * Fallback: CLERK_PUBLISHABLE_KEY (for Vercel compatibility)
 * 
 * Validates that the key starts with 'pk_test_' or 'pk_live_' prefix.
 * Returns undefined only if truly missing (not empty string).
 * 
 * Note: Both env names should have the same value for consistency.
 * ⚠️ After changing .env.local, restart dev server: `npm run dev`
 */
export function getClerkPublishableKey(): string | undefined {
  const key = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.CLERK_PUBLISHABLE_KEY;
  
  // Return undefined if missing or empty string
  if (!key || key.trim() === '') {
    return undefined;
  }
  
  // Validate key format (must start with pk_test_ or pk_live_)
  const trimmedKey = key.trim();
  if (!trimmedKey.startsWith('pk_test_') && !trimmedKey.startsWith('pk_live_')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Clerk] Invalid publishable key format. Expected key starting with "pk_test_" or "pk_live_", got:',
        trimmedKey.substring(0, 10) + '...'
      );
    }
    return undefined;
  }
  
  return trimmedKey;
}

