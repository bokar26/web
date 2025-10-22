import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function PredictiveLogisticsPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-white">Predictive logistics insights</h1>
        <p className="mt-4 text-lg text-gray-300">
          Anticipate delays, route disruptions, and capacity constraints before they impact your shipments. Make proactive decisions with AI-powered logistics intelligence.
        </p>
        <ul className="mt-8 space-y-3 text-gray-300">
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
