import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { BookDemoCTA } from "@/components/BookDemoCTA"

export default function ProcurementPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16">
        <h1 className="text-4xl font-bold text-white">Procurement</h1>
        <p className="mt-4 text-lg text-gray-300">
            Optimize supplier selection, quotes, and terms with AI reasoning over your SKU and PO history. See true landed cost before you commit, leverage transparent pricing data for better negotiations, and align MOQs with demand to drive significant cost savings.
          </p>
        </div>

        {/* High-Accuracy Supplier Matching Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">High-Accuracy Supplier Matching</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Incredibly High Match Accuracy</h3>
              <p className="text-gray-300">
                SLA uses advanced matching algorithms to connect you with the right suppliers based on your specific requirements. Our platform achieves incredibly high match accuracy by analyzing product specifications, quality requirements, capacity needs, and historical performance data to ensure perfect supplier-fit alignment.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">98.5%</div>
                  <div className="text-sm text-gray-400">Match Accuracy</div>
                  <div className="text-xs text-gray-500 mt-1">Quality aligned</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Match found: ABC Manufacturing specializes in your product type, 95% on-time rate, ISO certified</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Industry-Specific Expertise</h3>
              <p className="text-gray-300">
                Our matching system understands industry nuances, regulatory requirements, and production capabilities across different sectors. Whether you're sourcing for electronics, textiles, automotive parts, or consumer goods, SLA ensures suppliers match your industry standards and certifications.
              </p>
            </div>
          </div>
        </section>

        {/* Robust Vetting Process Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Robust Vetting Process</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Tier Vetting System</h3>
              <p className="text-gray-300">
                Every supplier in our network undergoes a comprehensive multi-tier vetting process that verifies financial stability, quality certifications, production capacity, compliance history, and performance track records. We don't just check boxes—we validate capability, reliability, and trustworthiness.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">500+</div>
                  <div className="text-sm text-gray-400">Your Verified Suppliers</div>
                  <div className="text-xs text-gray-500 mt-1">Fully vetted & certified</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Financial Stability & Compliance</h3>
              <p className="text-gray-300">
                All suppliers are evaluated for financial health, creditworthiness, and compliance with industry regulations and international standards. We verify audit histories, quality certifications (ISO, FDA, etc.), and regulatory compliance to ensure they can deliver consistently and meet your requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Raw Material & Cost Transparency Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Raw Material & Cost Transparency</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Detailed Cost Breakdown Access</h3>
              <p className="text-gray-300">
                SLA provides unprecedented access to raw material pricing, detailed cost breakdowns, and true landed-cost visibility. See exactly how every dollar is allocated—material costs, labor, overhead, margins, freight, duties, packaging, and warehouse fees—before you commit to a purchase order.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">100%</div>
                  <div className="text-sm text-gray-400">Cost Transparency</div>
                  <div className="text-xs text-gray-500 mt-1">Full breakdown</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">True Landed-Cost Preview</h3>
              <p className="text-gray-300">
                Get a complete preview of your true landed cost including product cost, freight charges, customs duties, packaging fees, and warehouse handling costs. Compare quotes on an apples-to-apples basis and make informed decisions that optimize your total cost of ownership, not just the sticker price.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Market Pricing Data</h3>
              <p className="text-gray-300">
                Access real-time market pricing data for raw materials and components. Track price trends, spot opportunities when costs drop, and negotiate from a position of informed strength. SLA's comprehensive market intelligence helps you time purchases and negotiate better terms.
              </p>
            </div>
          </div>
        </section>

        {/* Negotiation Leverage & Price Optimization Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Negotiation Leverage & Price Optimization</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Data-Driven Negotiation Advantage</h3>
              <p className="text-gray-300">
                Knowledge is power in procurement. SLA eliminates the information gap by providing you with detailed cost structures, market rate benchmarks, and comparable supplier data. When you know the true cost of production and can reference alternative quotes, negotiations become much more effective, and you save significantly on costs.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">18%</div>
                  <div className="text-sm text-gray-400">Avg Cost Reduction</div>
                  <div className="text-xs text-gray-500 mt-1">Through negotiation</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Negotiate with Supplier XYZ: Market data shows 15% margin, suggest 12% - save $47K annually</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Market Rate Benchmarking</h3>
              <p className="text-gray-300">
                Compare supplier quotes against industry standards and market rates. SLA's benchmarking data shows you exactly how competitive each quote is, helping you identify opportunities to negotiate better terms. Use comparable supplier data to leverage negotiations and ensure you're getting the best possible prices.
              </p>
            </div>
          </div>
        </section>

        {/* Current Supplier Cost Review Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Current Supplier Cost Review</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Identify Cost Reduction Opportunities</h3>
              <p className="text-gray-300">
                Upon request, SLA can review your current supplier costs and identify where they can be lowered through negotiation or by suggesting alternative suppliers with better capacity, terms, or pricing. Our analysis compares your current pricing against market rates and identifies actionable opportunities for cost savings.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">23</div>
                  <div className="text-sm text-gray-400">Opportunities</div>
                  <div className="text-xs text-gray-500 mt-1">Cost reduction identified</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Switch Supplier B → Supplier C: 11% cost reduction, better terms, faster lead time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Alternative Supplier Recommendations</h3>
              <p className="text-gray-300">
                Discover suppliers with better capacity, more favorable payment terms, lower MOQs, or superior quality ratings. SLA suggests similar suppliers that can provide better value while maintaining or improving quality standards, helping you optimize your supplier portfolio continuously.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Continuous Optimization</h3>
              <p className="text-gray-300">
                Procurement optimization isn't a one-time activity. SLA continuously monitors market conditions, supplier performance, and cost trends to provide ongoing recommendations for improvement. Stay ahead of price fluctuations, capacity constraints, and market opportunities to maintain a competitive advantage.
              </p>
            </div>
          </div>
        </section>

        {/* Supplier Comparison & Management Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Supplier Comparison & Management</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Comprehensive Comparison Metrics</h3>
              <p className="text-gray-300">
                Compare suppliers across critical dimensions including unit cost, lead times, on-time delivery percentages, defect rates, payment terms, minimum order quantities, and geographic proximity. SLA's comparison tools help you evaluate the total value proposition of each supplier, not just price.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">MOQ Alignment with Demand</h3>
              <p className="text-gray-300">
                Align minimum order quantities with your actual demand forecasts. Avoid overstocking or paying premiums for small orders. SLA helps you negotiate MOQs that match your consumption patterns, optimize inventory levels, and reduce carrying costs while ensuring you always have the right amount of materials when needed.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Quote Management & Analysis</h3>
              <p className="text-gray-300">
                Centralize quote management and analysis in one platform. Request quotes from multiple suppliers, compare them side-by-side, track negotiation progress, and make data-driven decisions. SLA's quote management system saves time, reduces errors, and ensures you always make optimal procurement decisions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Procurement?</h3>
            <p className="text-gray-300 mb-6">
              Experience how SLA's high-accuracy matching, robust vetting, transparent cost data, and powerful negotiation insights can optimize your procurement and deliver significant cost savings. Book a demo to see how we can help you build better supplier relationships and reduce costs.
            </p>
            <BookDemoCTA 
              variant="primary"
              dataLocation="procurement-page"
              className="inline-block rounded-lg bg-[#00FF7F] px-8 py-3 text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Book a Demo
            </BookDemoCTA>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}