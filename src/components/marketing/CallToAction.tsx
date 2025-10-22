"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CallToAction() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#00FF7F]">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Ready to make your supply chain predictive, not reactive?
          </h2>
          
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Join teams using SLA to forecast, optimize, and automate decisions across suppliers and routes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={() => scrollToSection("#pricing")}
            >
              Start free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
              onClick={() => scrollToSection("#how-it-works")}
            >
              See how it works
            </Button>
          </div>

          <p className="text-sm text-white/80">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
