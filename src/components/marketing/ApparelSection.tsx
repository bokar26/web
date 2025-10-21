import Image from "next/image"
import Link from "next/link"

export function ApparelSection() {
  return (
    <section className="section bg-white dark:bg-ink-900">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-ink-50">
              Built for apparel supply chains
            </h2>
            <p className="text-lg sm:text-xl text-ink-600 dark:text-ink-300 leading-relaxed">
              SLA ingests your SKU, PO, and shipment data, then applies machine learning to optimize 
              sourcing, routing, and working capital—the parts ERPs don&apos;t fix.
            </p>
            <ul className="space-y-3 text-base text-ink-700 dark:text-ink-300">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-emerald-600">•</span>
                <span>True landed-cost visibility (product, freight, duty, warehouse)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-emerald-600">•</span>
                <span>Predictive logistics insights that cut door-to-door time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-emerald-600">•</span>
                <span>Actionable supply insights to shorten your cash conversion cycle</span>
              </li>
            </ul>
            <div className="pt-4">
              <Link 
                href="/book-demo" 
                prefetch
                className="inline-flex items-center rounded-lg px-6 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Learn more
              </Link>
            </div>
          </div>
          
          {/* Right: Image */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/images/Preview-Monitor.png"
              alt="SLA Dashboard - Real-time supply chain intelligence"
              fill
              priority={false}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
