"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  TrendingDown, 
  Clock, 
  Search, 
  Calculator, 
  Route, 
  Plug 
} from "lucide-react"

const benefits = [
  {
    icon: TrendingDown,
    title: "Lower landed costs by ~30% on average",
    description: "AI-powered supplier matching finds better prices and reduces total landed costs across your supply chain.",
  },
  {
    icon: Clock,
    title: "Reduce ship time by ~25–30% on average",
    description: "Predictive lane, port, and carrier insights proactively adjust routes to avoid bottlenecks.",
  },
  {
    icon: Search,
    title: "One-click factory matching",
    description: "Instantly find suppliers that match your product requirements, quality standards, and capacity needs.",
  },
  {
    icon: Calculator,
    title: "Transparent duties & fees forecasting",
    description: "Get accurate cost breakdowns including duties, taxes, and fees before you commit to any shipment.",
  },
  {
    icon: Route,
    title: "Quote, compare, and route in one place",
    description: "Streamlined workflow from initial quote to final routing decision with real-time comparisons.",
  },
  {
    icon: Plug,
    title: "Works with your current tools",
    description: "Seamless integration with ERP systems, shipping platforms, and existing supply chain workflows.",
  },
]

export function Benefits() {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-ink-50 dark:bg-ink-900/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-ink-50 mb-6">
            Why choose SLA?
          </h2>
          <p className="text-lg sm:text-xl text-ink-600 dark:text-ink-300 max-w-3xl mx-auto">
            Focus on outcomes that matter—SLA turns fragmented data into real-time, actionable recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200 border-ink-200 dark:border-ink-700 hover:border-[#00FF7F]/60 bg-white dark:bg-ink-800/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#00FF7F]/10 rounded-lg flex items-center justify-center group-hover:bg-[#00FF7F]/20 transition-colors">
                        <Icon className="h-6 w-6 text-[#00FF7F]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-ink-900 dark:text-ink-50 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-ink-600 dark:text-ink-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
