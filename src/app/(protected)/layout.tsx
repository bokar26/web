"use client"

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import Sidebar from "@/components/dashboard/Sidebar"
import { Shell } from "@/components/shell/Shell"
import { isNewShellNavEnabled } from "@/lib/features"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const useNewShellNav = isNewShellNavEnabled()
  
  return (
    <>
      <SignedIn>
        {useNewShellNav ? (
          <Shell>{children}</Shell>
        ) : (
          <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto ml-16 lg:ml-64 transition-all duration-150 ease-out bg-background">
              {children}
            </main>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
