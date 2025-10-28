"use client"

import { BookDemoForm } from "@/components/BookDemoForm"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function BookDemoPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Book a Demo</h1>
          <p className="text-gray-300 mb-8">
            See how SLA can transform your supply chain operations
          </p>
          <BookDemoForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
