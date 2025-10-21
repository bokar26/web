import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function ProcurementPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-ink-900 dark:text-ink-50">Procurement</h1>
        <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">
          Optimize supplier selection, quotes, and terms with AI reasoning over your SKU and PO history. See true landed cost before you commit and align MOQs with demand.
        </p>
        <ul className="mt-8 space-y-3 text-ink-700 dark:text-ink-300">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Supplier comparison by cost, lead time, on-time %, and defect rates</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>True landed-cost preview (product, freight, duty, packaging, warehouse)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Recommendations to renegotiate terms and switch lanes/vendors</span>
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
