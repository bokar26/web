import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function ActionableSupplyInsightsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-ink-900 dark:text-ink-50">Actionable supply insights</h1>
        <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">
          Transform raw supply chain data into clear, actionable recommendations. SLA analyzes your SKU, PO, and shipment data to surface opportunities and risks.
        </p>
        <ul className="mt-8 space-y-3 text-ink-700 dark:text-ink-300">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Automated alerts for cost overruns, delays, and quality issues</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Vendor performance scorecards with improvement suggestions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Executive dashboards with KPIs that matter to apparel businesses</span>
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
