import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function ActionableSupplyInsightsPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-white">Actionable supply insights</h1>
        <p className="mt-4 text-lg text-gray-300">
          Transform raw supply chain data into clear, actionable recommendations. SLA analyzes your SKU, PO, and shipment data to surface opportunities and risks.
        </p>
        <ul className="mt-8 space-y-3 text-gray-300">
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
            className="inline-block rounded-lg bg-white px-6 py-3 text-black font-medium hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book a demo
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
