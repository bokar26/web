export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  EDGE_DEMO_INGEST_URL: process.env.NEXT_PUBLIC_EDGE_DEMO_INGEST_URL || '',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || 
    process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '',
  CAPTCHA_TYPE: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'turnstile' : 'hcaptcha'
} as const

// Export clean named constants for easy importing
export const EDGE_DEMO_URL = env.EDGE_DEMO_INGEST_URL
export const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
export const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY

