"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Integrate your data (including POS)",
    description: "Connect suppliers, shipments, ERP/TMS, and POS. SLA unifies and cleans data in real time.",
  },
  {
    number: "02", 
    title: "Get matched suppliers + routes",
    description: "Receive curated supplier recommendations and optimized shipping routes based on cost, time, and reliability.",
  },
  {
    number: "03",
    title: "Pick the best cost-time trade-off",
    description: "Compare options side-by-side and choose the optimal balance of cost, speed, and quality for your business.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 mb-6">
            How it works?
          </h2>
          <p className="text-lg sm:text-xl text-ink-600 max-w-3xl mx-auto">
            Get started with SLA in three simple steps. No complex setup, no lengthy onboarding—just results.
          </p>
        </div>

        {/* Desktop: Horizontal layout with arrows */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex flex-col items-center">
                  <Card className="w-80 hover:shadow-lg transition-all duration-200 border-ink-200 hover:border-emerald-200">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-white font-bold text-xl">
                            {step.number}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-ink-900 mb-4">
                          {step.title}
                        </h3>
                        <p className="text-ink-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center px-8 pt-16">
                    <ArrowRight className="h-8 w-8 text-emerald-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical stack */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border-ink-200 hover:border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-ink-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
