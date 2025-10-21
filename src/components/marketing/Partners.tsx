"use client"

import { useEffect, useState } from "react"

const partners = [
  { name: "Nike", logo: "/images/partners/nike.svg" },
  { name: "Adidas", logo: "/images/partners/adidas.svg" },
  { name: "Amazon", logo: "/images/partners/amazon.svg" },
  { name: "Walmart", logo: "/images/partners/walmart.svg" },
  { name: "Target", logo: "/images/partners/target.svg" },
  { name: "Costco", logo: "/images/partners/costco.svg" },
  { name: "Home Depot", logo: "/images/partners/homedepot.svg" },
  { name: "Best Buy", logo: "/images/partners/bestbuy.svg" },
]

export function Partners() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById("partners")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="partners" className="py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-ink-500 uppercase tracking-wide">
            Trusted by companies at:
          </p>
        </div>

        {/* Desktop: Static grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className={`flex items-center justify-center h-12 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-24 h-12 bg-ink-200 rounded-lg flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs font-medium text-ink-600">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Auto-scroll */}
        <div className="md:hidden overflow-hidden">
          <div className="flex animate-scroll space-x-8">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-20 h-10 bg-ink-200 rounded-lg flex items-center justify-center opacity-50"
              >
                <span className="text-xs font-medium text-ink-600">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  )
}
