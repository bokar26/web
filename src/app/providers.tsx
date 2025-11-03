"use client";

import { ClerkProvider } from "@clerk/nextjs";
import * as React from "react";
import { getClerkPublishableKey, diagnoseClerkEnv } from "@/lib/env";

export default function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = getClerkPublishableKey();

  // Server-side sanity check (runs during SSR, before client hydration)
  // This is safe because we're in a Client Component - React will handle this correctly
  if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
    if (publishableKey) {
      const keyPrefix = publishableKey.substring(0, 6);
      console.log(`[Clerk] Server-side: Publishable key detected: ${keyPrefix}...`);
    } else {
      console.warn(
        "[Clerk] Server-side: Missing publishable key. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local"
      );
    }
  }

  // Dev-mode logging: show key prefix once at mount (client-side)
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      // Run detailed diagnostic on client-side
      diagnoseClerkEnv();
      
      if (publishableKey) {
        const keyPrefix = publishableKey.substring(0, 6);
        console.log(`[Clerk] Client-side: Publishable key detected: ${keyPrefix}...`);
      } else {
        console.error(
          "[Clerk] Client-side: Missing publishable key. This will trigger keyless mode. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local and restart the dev server."
        );
      }
    }
  }, [publishableKey]);

  // Fail fast: prevent keyless mode by ensuring key is always defined
  if (!publishableKey) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div style={{ 
          padding: '2rem', 
          background: '#fee', 
          color: '#c00', 
          border: '2px solid #c00',
          margin: '2rem',
          borderRadius: '8px'
        }}>
          <h2 style={{ marginTop: 0 }}>Clerk Configuration Error</h2>
          <p>
            <strong>Missing publishable key.</strong> Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to{' '}
            <code>apps/web/.env.local</code> and restart the dev server.
          </p>
          <p style={{ marginBottom: 0 }}>
            Get your keys from:{' '}
            <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>
              https://dashboard.clerk.com
            </a>
          </p>
        </div>
      );
    }
    // In production, fail silently or return a minimal error boundary
    // This prevents keyless mode from activating
    return (
      <div style={{ 
        padding: '2rem', 
        background: '#f5f5f5', 
        color: '#333', 
        textAlign: 'center'
      }}>
        <p>Authentication service is temporarily unavailable. Please try again later.</p>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}
