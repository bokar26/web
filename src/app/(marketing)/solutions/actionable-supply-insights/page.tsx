import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { BookDemoCTA } from "@/components/BookDemoCTA"

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
          <BookDemoCTA 
            variant="primary"
            dataLocation="supply-insights-page"
            className="inline-block rounded-lg bg-[#00FF7F] px-6 py-3 text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Book a demo
          </BookDemoCTA>
        </div>
      </main>
      <Footer />
    </div>
  )
}
