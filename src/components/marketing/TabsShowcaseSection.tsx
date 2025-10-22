"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "demand-forecasting", label: "Demand Forecasting" },
  { id: "cost-projections", label: "Cost Projections" },
  { id: "predictive-logistics", label: "Predictive Logistics" },
  { id: "forecast-risk", label: "Forecast & Risk" },
  { id: "custom", label: "Custom" },
]

export function TabsShowcaseSection() {
  const [activeTab, setActiveTab] = useState<string>("demand-forecasting")

  const handleKeyDown = (e: React.KeyboardEvent, currentTabId: string) => {
    const currentIndex = tabs.findIndex(t => t.id === currentTabId)
    
    switch(e.key) {
      case "ArrowLeft":
        e.preventDefault()
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1].id)
        }
        break
      case "ArrowRight":
        e.preventDefault()
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1].id)
        }
        break
      case "Enter":
      case " ":
        e.preventDefault()
        setActiveTab(currentTabId)
        break
    }
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case "demand-forecasting":
        return (
          <>
            <p className="text-lg text-white/90 mb-6">
              Blend historical sales, seasonality, promotions, and external signals to generate SKU-level forecasts. SLA tracks forecast error and bias by product, channel, and region to continuously improve accuracy.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">MAPE (30-day)</div>
                <div className="text-xl font-bold text-white">8.9% → <span className="text-[#00FF7F]">6.2%</span></div>
                <div className="text-xs text-white/60">after model tuning</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Bias (All SKUs)</div>
                <div className="text-xl font-bold text-white">+2.1% → <span className="text-[#00FF7F]">+0.4%</span></div>
                <div className="text-xs text-white/60">improved accuracy</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Forecast horizon</div>
                <div className="text-xl font-bold text-white">2–26 weeks</div>
                <div className="text-xs text-white/60">flexible planning</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Inputs</div>
                <div className="text-lg font-medium text-white">POS, returns, promo calendar, weather, macro index</div>
              </div>
            </div>
            
            <p className="text-sm text-white/60 border-t border-white/10 pt-4 mt-4">
              Auto-retraining weekly; anomaly detection on spikes/dips.
            </p>
          </>
        )

      case "cost-projections":
        return (
          <>
            <p className="text-lg text-white/90 mb-6">
              Project landed cost per unit by scenario: supplier, MOQ, incoterms, port pair, freight mode, duties, and currency. SLA simulates FX, fuel surcharges, and tariff shifts to expose true margin.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Baseline LCU</div>
                <div className="text-xl font-bold text-white">$4.18 → <span className="text-[#00FF7F]">$3.86</span></div>
                <div className="text-xs text-white/60">Scenario B (-7.7%)</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Duty (HS 6115)</div>
                <div className="text-xl font-bold text-white">14.6% → <span className="text-[#00FF7F]">9.8%</span></div>
                <div className="text-xs text-white/60">with alt origin</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Freight / unit</div>
                <div className="text-xl font-bold text-white">$0.62 (ocean) vs <span className="text-[#00FF7F]">$1.94</span> (air)</div>
                <div className="text-xs text-white/60">mode comparison</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">FX impact</div>
                <div className="text-xl font-bold text-white">± <span className="text-[#00FF7F]">2.4%</span> margin</div>
                <div className="text-xs text-white/60">@ 30-day volatility</div>
              </div>
            </div>
            
            <p className="text-sm text-white/60 border-t border-white/10 pt-4 mt-4">
              Breakout: EXW/FOB, drayage, origin/destination fees, insurance.
            </p>
          </>
        )

      case "predictive-logistics":
        return (
          <>
            <p className="text-lg text-white/90 mb-6">
              Predict ETA and risk by route and mode. SLA highlights late-arrival probability, congestion indices, and recommends mode/port swaps to hit service levels.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">On-time probability</div>
                <div className="text-xl font-bold text-white"><span className="text-[#00FF7F]">92%</span> (Alt Route) vs 78% (Baseline)</div>
                <div className="text-xs text-white/60">improved reliability</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Median transit</div>
                <div className="text-xl font-bold text-white">21d (ocean) / 5d (air)</div>
                <div className="text-xs text-white/60">mode comparison</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Port risk score</div>
                <div className="text-xl font-bold text-white">0.18 (Shanghai) vs <span className="text-[#00FF7F]">0.07</span> (Ningbo)</div>
                <div className="text-xs text-white/60">lower risk option</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Buffer days suggested</div>
                <div className="text-xl font-bold text-white"><span className="text-[#00FF7F]">+3</span> (holiday surge)</div>
                <div className="text-xs text-white/60">seasonal adjustment</div>
              </div>
            </div>
            
            <p className="text-sm text-white/60 border-t border-white/10 pt-4 mt-4">
              Signals: AIS vessel data, port dwell, weather, labor actions.
            </p>
          </>
        )

      case "forecast-risk":
        return (
          <>
            <p className="text-lg text-white/90 mb-6">
              Stress test demand and supply simultaneously. SLA quantifies service-level, stockout risk, and working-capital effects under best/likely/worst cases.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Service level (P95)</div>
                <div className="text-xl font-bold text-white">97.2% → <span className="text-[#00FF7F]">98.6%</span></div>
                <div className="text-xs text-white/60">with reorder tweak</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Stockout risk (30-day)</div>
                <div className="text-xl font-bold text-white"><span className="text-[#00FF7F]">-41%</span> after safety-stock rebalance</div>
                <div className="text-xs text-white/60">risk reduction</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Cash tied in WIP</div>
                <div className="text-xl font-bold text-white"><span className="text-[#00FF7F]">-$182K</span> by lead-time pull-in</div>
                <div className="text-xs text-white/60">working capital improvement</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Backorder exposure</div>
                <div className="text-xl font-bold text-white"><span className="text-[#00FF7F]">-28%</span> via supplier split 60/40</div>
                <div className="text-xs text-white/60">supplier diversification</div>
              </div>
            </div>
            
            <p className="text-sm text-white/60 border-t border-white/10 pt-4 mt-4">
              Outputs: reorder points, safety stock, cash conversion cycle.
            </p>
          </>
        )

      case "custom":
        return (
          <>
            <p className="text-lg text-white/90 mb-6">
              Your dashboard, your KPIs. We'll tailor SLA to your SKUs, channels, and constraints—add proprietary scores, custom alerts, or executive rollups.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Vendor score</div>
                <div className="text-lg font-medium text-white">OTIF, defect rate, audit recency, ESG</div>
                <div className="text-xs text-white/60">comprehensive evaluation</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Promo lift</div>
                <div className="text-lg font-medium text-white">per-SKU elasticity and cannibalization</div>
                <div className="text-xs text-white/60">marketing optimization</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Allocation</div>
                <div className="text-lg font-medium text-white">DC-level demand vs labor/slotting caps</div>
                <div className="text-xs text-white/60">capacity planning</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/70 mb-1">Compliance</div>
                <div className="text-lg font-medium text-white">carton spec, labeling, ASN fill rate</div>
                <div className="text-xs text-white/60">regulatory adherence</div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-4">
              <Link
                href="/book-demo"
                className="inline-flex items-center rounded-lg px-6 py-3 bg-[#00FF7F] text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                data-analytics="solutions-tab:custom-cta"
              >
                Book a Custom Build
              </Link>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <section id="solutions-tabs" className="py-16 sm:py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Plan Smarter with SLA
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Data-driven insights for every aspect of your supply chain
          </p>
        </div>

        {/* Tab List */}
        <div 
          role="tablist" 
          className="flex items-center gap-6 border-b border-white/10 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              data-analytics={`solutions-tab:${tab.label}`}
              className={cn(
                "text-sm sm:text-base font-medium px-4 py-3 border-b-2 transition whitespace-nowrap snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                activeTab === tab.id
                  ? "text-white border-[#00FF7F]"
                  : "text-white/70 border-transparent hover:text-white hover:border-white/30"
              )}
            >
              {tab.label}
            </button>
          ))}
          <Link
            href="/solutions"
            className="ml-auto text-[#00FF7F] hover:opacity-90 underline-offset-4 hover:underline text-sm sm:text-base font-medium px-4 py-3 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
            data-analytics="solutions-tab:see-more"
          >
            See more →
          </Link>
        </div>

        {/* Tab Content */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="mt-8 bg-neutral-900/40 border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          {renderTabContent()}
        </div>
      </div>
    </section>
  )
}
