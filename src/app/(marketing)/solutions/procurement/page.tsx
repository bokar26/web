import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function ProcurementPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-white">Procurement</h1>
        <p className="mt-4 text-lg text-gray-300">
          Optimize supplier selection, quotes, and terms with AI reasoning over your SKU and PO history. See true landed cost before you commit and align MOQs with demand.
        </p>
        <ul className="mt-8 space-y-3 text-gray-300">
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
