import { createClient } from '@supabase/supabase-js'

/**
 * Dev-only diagnostic for Supabase environment variables.
 * Logs URL host and anon key length (not the full key).
 */
function diagnoseSupabaseEnv() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[Supabase Env Diagnostic] Server: Missing Supabase env vars. Checked NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
    return;
  }

  try {
    const url = new URL(supabaseUrl);
    const host = url.hostname;
    const keyLength = supabaseAnonKey.length;
    
    console.log(
      `[Supabase Env Diagnostic] Server: NEXT_PUBLIC_SUPABASE_URL = https://${host}`
    );
    console.log(
      `[Supabase Env Diagnostic] Server: NEXT_PUBLIC_SUPABASE_ANON_KEY length: ${keyLength}`
    );
    console.log(
      `[Supabase Env Diagnostic] Server: ✓ Supabase env vars loaded successfully`
    );
  } catch {
    console.warn(
      `[Supabase Env Diagnostic] Server: ⚠️ Invalid SUPABASE_URL format: ${supabaseUrl}`
    );
  }
}

// Run diagnostic at module load (server-side only)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  diagnoseSupabaseEnv();
}

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set')
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error: any) {
    console.error('[Supabase] Failed to create client:', error)
    return null
  }
}

