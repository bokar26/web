"use client"

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import Sidebar from "@/components/dashboard/Sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SignedIn>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <main className="flex-1 overflow-y-auto ml-16 lg:ml-64 transition-all duration-150 ease-out">
            {children}
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
