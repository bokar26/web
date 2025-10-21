import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function PredictiveLogisticsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-ink-900 dark:text-ink-50">Predictive logistics insights</h1>
        <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">
          Anticipate delays, route disruptions, and capacity constraints before they impact your shipments. Make proactive decisions with AI-powered logistics intelligence.
        </p>
        <ul className="mt-8 space-y-3 text-ink-700 dark:text-ink-300">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Real-time delay predictions by carrier, route, and port</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Alternative routing suggestions to avoid congestion</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Cost-speed trade-off analysis for every shipment</span>
          </li>
        </ul>
        <div className="mt-10">
          <Link 
            href="/book-demo" 
            className="inline-block rounded-lg bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Book a demo
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
