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
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold text-white">Solutions</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
          SLA delivers AI-powered intelligence tailored for apparel supply chains, helping you reduce costs, improve delivery times, and make smarter decisions.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <Link
              key={solution.name}
              href={solution.href}
              prefetch
              className="p-6 rounded-xl border border-white/20 hover:border-emerald-400 transition-colors bg-neutral-900"
            >
              <h2 className="text-xl font-semibold text-white">{solution.name}</h2>
              <p className="mt-2 text-gray-300">{solution.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
