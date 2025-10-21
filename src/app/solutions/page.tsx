import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function SolutionsPage() {
  const solutions = [
    { name: "Procurement", href: "/solutions/procurement", desc: "Optimize supplier selection and true landed costs" },
    { name: "Inventory Management", href: "/solutions/inventory-management", desc: "Balance stock levels with demand forecasts" },
    { name: "Predictive logistics insights", href: "/solutions/predictive-logistics-insights", desc: "Anticipate delays and route disruptions" },
    { name: "Actionable supply insights", href: "/solutions/actionable-supply-insights", desc: "Data-driven decisions for your supply chain" },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-ink-900 dark:text-ink-50">Solutions</h1>
        <p className="mt-4 text-lg text-ink-600 dark:text-ink-300 max-w-2xl">
          SLA delivers AI-powered intelligence tailored for apparel supply chains, helping you reduce costs, improve delivery times, and make smarter decisions.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <Link
              key={solution.name}
              href={solution.href}
              prefetch
              className="p-6 rounded-xl border border-ink-200 dark:border-ink-700 hover:border-emerald-500 transition-colors bg-white dark:bg-ink-800"
            >
              <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-50">{solution.name}</h2>
              <p className="mt-2 text-ink-600 dark:text-ink-300">{solution.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
