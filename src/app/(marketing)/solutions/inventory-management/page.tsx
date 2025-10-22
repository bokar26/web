import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function InventoryManagementPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-white">Inventory Management</h1>
        <p className="mt-4 text-lg text-gray-300">
          Balance stock levels with AI-driven demand forecasts. Reduce overstock and stockouts while optimizing working capital for your apparel business.
        </p>
        <ul className="mt-8 space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Demand forecasting by SKU, season, and sales channel</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Optimal reorder points and safety stock recommendations</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Working capital optimization to free up cash</span>
          </li>
        </ul>
        <div className="mt-10">
          <Link 
            href="/book-demo" 
            className="inline-block rounded-lg bg-[#00FF7F] px-6 py-3 text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Book a demo
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
