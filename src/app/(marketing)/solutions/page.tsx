"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { ArrowRight } from "lucide-react"

export default function SolutionsPage() {
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    let mounted = true
    
    const handleScroll = () => {
      if (!mounted) return
      
      const sections = document.querySelectorAll('[data-section]')
      if (!sections || sections.length === 0) return
      
      const scrollPosition = window.scrollY + 200

      sections.forEach((section) => {
        const element = section as HTMLElement
        if (!element) return
        
        const top = element.offsetTop
        const bottom = top + element.offsetHeight

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(element.dataset.section || "overview")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      mounted = false
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      setActiveSection(sectionId)
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const navigationItems = [
    { id: "overview", label: "Overview" },
    { id: "procurement", label: "Procurement" },
    { id: "inventory", label: "Inventory Management" },
    { id: "logistics", label: "Predictive Logistics" },
    { id: "supply", label: "Actionable Supply Insights" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Column - Sticky Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                Solutions
              </h2>
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === item.id
                        ? "bg-[#00FF7F]/10 text-[#00FF7F] border-l-2 border-[#00FF7F]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Column - Content */}
          <div className="lg:col-span-3">
            <div className="max-w-3xl space-y-20">
              {/* Overview Section */}
              <section id="overview" data-section="overview" className="scroll-mt-20">
                <h1 className="text-4xl font-bold text-white mb-6">
                  Solutions for an Optimized Supply Chain
                </h1>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    SLA's integrated suite of solutions works together to transform your supply chain operations. Each module is designed to work independently or seamlessly integrate, providing you with full control over your optimization strategy.
                  </p>
                  <p>
                    Our platform combines AI-powered insights with real-time data, enabling you to make informed decisions that cut costs, reduce cycle times, and improve operational efficiency. Whether you're focused on procurement, inventory, logistics, or overall supply chain visibility, SLA provides the tools you need.
                  </p>
                  <p className="font-semibold text-white">
                    Every solution is fully customizable to match your business processes, data sources, and strategic objectives. Configure workflows, set custom alerts, and define your own KPIs to measure success your way.
                  </p>
                  <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 rounded-lg p-6 mt-8">
                    <h3 className="text-white font-semibold mb-3">Integrated Approach</h3>
                    <p>
                      All SLA solutions share common data models and integrate seamlessly. Procurement decisions inform inventory needs. Logistics insights update supply forecasts. Every module contributes to a unified view of your supply chain.
                    </p>
                  </div>
                </div>
              </section>

              {/* Procurement Section */}
              <section id="procurement" data-section="procurement" className="scroll-mt-20">
                <h2 className="text-3xl font-bold text-white mb-4">Procurement</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Optimize supplier selection and true landed costs with AI-powered procurement intelligence.
                </p>
                <div className="space-y-4 text-gray-300">
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Supplier Matching</h3>
                    <p>
                      Automatically match your requirements with the best suppliers based on cost, quality, lead time, and reliability scores.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">True Landed Cost Analysis</h3>
                    <p>
                      Calculate complete cost per unit including shipping, duties, tariffs, and handling fees across multiple countries and suppliers.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Contract Management</h3>
                    <p>
                      Track supplier agreements, monitor performance, and automatically flag deviations from negotiated terms.
                    </p>
                  </div>
                </div>
                <Link
                  href="/solutions/procurement"
                  className="inline-flex items-center mt-6 text-[#00FF7F] hover:text-[#00FF7F]/80 transition-colors"
                >
                  Learn more about Procurement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </section>

              {/* Inventory Management Section */}
              <section id="inventory" data-section="inventory" className="scroll-mt-20">
                <h2 className="text-3xl font-bold text-white mb-4">Inventory Management</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Balance stock levels with demand forecasts to shorten cash conversion cycles and reduce carrying costs.
                </p>
                <div className="space-y-4 text-gray-300">
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Demand Forecasting</h3>
                    <p>
                      Use machine learning to predict demand patterns, seasonality, and market trends to optimize your inventory levels.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Reorder Point Optimization</h3>
                    <p>
                      Automatically calculate optimal reorder points and order quantities based on lead times, demand variability, and service level requirements.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Cash Flow Analysis</h3>
                    <p>
                      Understand the cash impact of inventory decisions and optimize your working capital allocation across SKUs and categories.
                    </p>
                  </div>
                </div>
                <Link
                  href="/solutions/inventory-management"
                  className="inline-flex items-center mt-6 text-[#00FF7F] hover:text-[#00FF7F]/80 transition-colors"
                >
                  Learn more about Inventory Management
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </section>

              {/* Predictive Logistics Section */}
              <section id="logistics" data-section="logistics" className="scroll-mt-20">
                <h2 className="text-3xl font-bold text-white mb-4">Predictive Logistics Insights</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Anticipate delays and route disruptions before they impact your deliveries.
                </p>
                <div className="space-y-4 text-gray-300">
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Risk Prediction</h3>
                    <p>
                      Identify high-risk shipments and routes using historical data, weather patterns, and logistics network performance metrics.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Route Optimization</h3>
                    <p>
                      Calculate the most efficient shipping routes considering port congestion, carrier performance, and cost constraints.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Carrier Performance</h3>
                    <p>
                      Track on-time delivery, damage rates, and cost efficiency across carriers to make data-driven logistics decisions.
                    </p>
                  </div>
                </div>
                <Link
                  href="/solutions/predictive-logistics-insights"
                  className="inline-flex items-center mt-6 text-[#00FF7F] hover:text-[#00FF7F]/80 transition-colors"
                >
                  Learn more about Predictive Logistics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </section>

              {/* Actionable Supply Insights Section */}
              <section id="supply" data-section="supply" className="scroll-mt-20">
                <h2 className="text-3xl font-bold text-white mb-4">Actionable Supply Insights</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Data-driven decisions for your entire supply chain with real-time visibility and intelligent recommendations.
                </p>
                <div className="space-y-4 text-gray-300">
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Supply Chain Visibility</h3>
                    <p>
                      Get a unified view of your entire supply chain from sourcing to final delivery with real-time status updates across all touchpoints.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Intelligent Recommendations</h3>
                    <p>
                      Receive AI-generated suggestions for cost savings, efficiency improvements, and risk mitigation based on your unique data patterns.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF7F] pl-4">
                    <h3 className="text-white font-semibold mb-2">Customizable Dashboards</h3>
                    <p>
                      Build custom dashboards tailored to your role, displaying the KPIs and metrics that matter most to your decision-making process.
                    </p>
                  </div>
                </div>
                <Link
                  href="/solutions/actionable-supply-insights"
                  className="inline-flex items-center mt-6 text-[#00FF7F] hover:text-[#00FF7F]/80 transition-colors"
                >
                  Learn more about Supply Insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}