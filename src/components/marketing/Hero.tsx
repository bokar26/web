"use client"

import Link from "next/link"
import { BookDemoCTA } from "@/components/BookDemoCTA"

interface HeroProps {
  headline?: string
  subcopy?: string
  socialProof?: string
}

export function Hero({
  headline = "SCM done right.",
  subcopy = "SLA fuses ERP essentials with AI and ML intelligence to build faster, smarter, and more robust workflows.",
  socialProof = "Driven by the world's most precise optimization models",
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-start pt-4 md:pt-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Centered text block */}
        <div className="mx-auto max-w-7xl text-center space-y-4 sm:space-y-5 md:space-y-6 relative z-10 py-6 sm:py-8 md:py-10">
          {/* Social proof chip - center with mx-auto */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 mx-auto mb-2 sm:mb-3">
            <span className="text-sm font-medium text-white">
              {socialProof}
            </span>
          </div>
          
          {/* Headline - center aligned */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight whitespace-pre-line mb-3 sm:mb-4">
            {headline}
          </h1>
          
          {/* Subcopy - center aligned */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-4 sm:mb-5 md:mb-6">
            {subcopy}
          </p>
          
          {/* CTA - centered with mx-auto */}
          <div className="pt-2 sm:pt-3">
            <BookDemoCTA 
              variant="primary"
              dataLocation="hero"
              className="inline-flex items-center rounded-lg px-7 py-3.5 bg-[#00FF7F] text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Book a demo
            </BookDemoCTA>
          </div>

          {/* Solutions row - spread out with subtext in bordered box */}
          <div className="pt-8 sm:pt-10 md:pt-12 lg:pt-14 relative">
            <div className="border-2 border-white/20 rounded-lg p-4 sm:p-6 md:p-8 relative mx-auto max-w-5xl">
              {/* Border break with text */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4">
                <span className="text-xs sm:text-sm font-medium text-white">
                  Optimized with SLA
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-16 text-lg sm:text-xl md:text-2xl">
                <div className="text-center">
                  <Link 
                    href="/solutions/procurement" 
                    prefetch
                    className="text-white hover:text-[#00FF7F] transition-colors font-bold block"
                  >
                    Procurement
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">AI procurement tools</p>
                </div>
                <div className="text-center">
                  <Link 
                    href="/solutions/inventory-management" 
                    prefetch
                    className="text-white hover:text-[#00FF7F] transition-colors font-bold block"
                  >
                    Inventory
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">Shorten cash conversion cycles</p>
                </div>
                <div className="text-center">
                  <Link 
                    href="/solutions/predictive-logistics-insights" 
                    prefetch
                    className="text-white hover:text-[#00FF7F] transition-colors font-bold block"
                  >
                    Logistics
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">Predictive logistics insights</p>
                </div>
                <div className="text-center">
                  <Link 
                    href="/solutions/actionable-supply-insights" 
                    prefetch
                    className="text-white hover:text-[#00FF7F] transition-colors font-bold block"
                  >
                    Supply
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">Actionable supply insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF7F]/10 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-100 rounded-full opacity-10 blur-3xl" />
      </div>
    </section>
  )
}
