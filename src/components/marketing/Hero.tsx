"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"

interface HeroProps {
  headline?: string
  subcopy?: string
  socialProof?: string
  primaryCTA?: { text: string; href: string }
}

export function Hero({
  headline = "Optimize your supply chain with live AI intelligence",
  subcopy = "SLA combines AI reasoning and machine-learning models with your SKU, PO, and shipment data to cut landed costs, speed up deliveries, and shorten cash cycles.",
  socialProof = "Trusted by leading apparel companies",
  primaryCTA = { text: "Book a demo", href: "/book-demo" },
}: HeroProps) {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-start pt-4 md:pt-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Centered text block */}
        <div className="mx-auto max-w-5xl text-center space-y-6 relative z-10">
          {/* Social proof chip - center with mx-auto */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 mx-auto">
            <span className="text-sm font-medium text-white">
              {socialProof}
            </span>
          </div>
          
          {/* Headline - center aligned */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {headline}
          </h1>
          
          {/* Subcopy - center aligned */}
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            {subcopy}
          </p>
          
          {/* CTA - centered with mx-auto */}
          <div className="pt-2">
            <Link 
              href={primaryCTA.href} 
              prefetch
              className="inline-flex items-center rounded-lg px-6 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {primaryCTA.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Solutions row - spread out with subtext in bordered box */}
          <div className="pt-16 relative">
            <div className="border-2 border-white/20 rounded-lg p-8 relative mx-auto max-w-5xl">
              {/* Border break with text */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4">
                <span className="text-sm font-medium text-white">
                  Optimized with SLA
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-16 text-2xl">
                <div className="text-center">
                  <Link 
                    href="/solutions/procurement" 
                    prefetch
                    className="text-white hover:text-emerald-400 transition-colors font-bold block"
                  >
                    Procurement
                  </Link>
                  <p className="text-sm text-gray-300 mt-2">AI procurement tools</p>
                </div>
                <div className="text-center">
                  <Link 
                    href="/solutions/inventory-management" 
                    prefetch
                    className="text-white hover:text-emerald-400 transition-colors font-bold block"
                  >
                    Inventory
                  </Link>
                  <p className="text-sm text-gray-300 mt-2">Shorten cash conversion cycles</p>
                </div>
                <div className="text-center">
                  <Link 
                    href="/solutions/predictive-logistics-insights" 
                    prefetch
                    className="text-white hover:text-emerald-400 transition-colors font-bold block"
                  >
                    Logistics
                  </Link>
                  <p className="text-sm text-gray-300 mt-2">Predictive logistics insights</p>
                </div>
                <div className="text-center">
                  <Link 
                    href="/solutions/actionable-supply-insights" 
                    prefetch
                    className="text-white hover:text-emerald-400 transition-colors font-bold block"
                  >
                    Supply
                  </Link>
                  <p className="text-sm text-gray-300 mt-2">Actionable supply insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-100 rounded-full opacity-10 blur-3xl" />
      </div>
    </section>
  )
}
