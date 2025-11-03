"use client"

import { useEffect, useRef, useState } from "react"

export function Problem() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="section-tight bg-black relative z-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Text content */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Legacy systems are holding supply chain teams back.
            </h2>
            <div className="space-y-4">
              <p className="text-xl sm:text-2xl font-semibold text-white">
                Your ERP should help you move faster, not hold you back.
              </p>
              <p className="text-lg text-gray-300">
                SLA turns static reports into live insights that improve forecasting accuracy, cost visibility, and cash flow.
              </p>
              <p className="text-lg text-gray-300">
                See true costs, predict delays, and act faster — all in one connected system.
              </p>
            </div>
          </div>
          
          {/* Right: Cards with "without SLA" context and slide-in animation */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-red-400 uppercase tracking-wide">
              Without SLA
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { text: "Inaccurate forecasts & disconnected data", delay: 0 },
                { text: "Poor financial visibility", delay: 100 },
                { text: "Clunky, outdated tools", delay: 200 },
                { text: "New AI-focused systems make data hard to access", delay: 300 },
                { text: "Unnecessary manual input", delay: 400 }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-6 bg-neutral-900 rounded-lg border border-white/20 shadow-sm transition-all duration-700 ${
                    isVisible 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <h3 className="text-lg font-semibold text-white flex items-start">
                    <span className="text-red-400 mr-2 flex-shrink-0">❌</span>
                    <span>{item.text}</span>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}