import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { BookDemoCTA } from "@/components/BookDemoCTA"

export default function PredictiveLogisticsPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white">Predictive Logistics Insights</h1>
        <p className="mt-4 text-lg text-gray-300">
            Anticipate delays, route disruptions, and capacity constraints before they impact your shipments. Make proactive decisions with AI-powered logistics intelligence and find the right logistics partners to optimize your entire supply chain.
          </p>
        </div>

        {/* Find Logistics Partners Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Find the Right Logistics Partners</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Warehouses</h3>
              <p className="text-gray-300">
                Discover strategically located warehouses with optimal costs, services, and capacity. Compare locations based on proximity to your facilities, shipping lanes, and customer bases. SLA helps you find warehouse partners that minimize transit times and reduce overall supply chain costs.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">15</div>
                  <div className="text-sm text-gray-400">Warehouses Found</div>
                  <div className="text-xs text-gray-500 mt-1">Within 50 miles</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Consider XYZ Warehouse in Oakland - 30% lower cost, 2-day faster delivery</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Freight Forwarders</h3>
              <p className="text-gray-300">
                Compare freight forwarders by rates, transit times, reliability scores, and service quality. Get competitive quotes from multiple providers and make data-driven decisions. Track historical performance to identify the most reliable partners for your routes and shipment types.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Carriers for All Shipping Modes</h3>
              <p className="text-gray-300">
                Find carriers for ocean freight, air cargo, ground transportation, and last-mile delivery. Compare service levels, costs, and reliability across all transportation modes. Optimize your carrier mix to balance speed, cost, and reliability based on your priorities.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Last-Mile Delivery Networks</h3>
              <p className="text-gray-300">
                Connect with local carrier networks specialized in last-mile delivery. Find cost-effective solutions for final delivery to end customers, whether for B2B or B2C shipments. Optimize last-mile costs while maintaining customer satisfaction and delivery speed.
              </p>
            </div>
          </div>
        </section>

        {/* Plan Shipments & Inventory Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Plan Shipments & Inventory</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Integration with Current Logistics Solutions</h3>
              <p className="text-gray-300">
                Seamlessly integrate SLA with your existing logistics solutions and TMS platforms. Import data from your current systems and leverage SLA's insights to enhance your existing workflows without disrupting operations.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Optimize Inventory Placement</h3>
              <p className="text-gray-300">
                Strategically place inventory across warehouses to minimize transit times and costs. Analyze demand patterns, customer locations, and shipping lanes to determine optimal distribution network design. Reduce overall inventory while improving service levels.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Plan Shipment Consolidation</h3>
              <p className="text-gray-300">
                Identify opportunities to consolidate shipments and reduce costs. Group smaller orders together, optimize loading configurations, and plan multi-stop routes. Balance cost savings with delivery timelines and customer expectations.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">23%</div>
                  <div className="text-sm text-gray-400">Cost Savings</div>
                  <div className="text-xs text-gray-500 mt-1">Through consolidation</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Consolidate 5 pending shipments to Los Angeles - Save $340, deliver Tuesday</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Balance Speed vs. Cost</h3>
              <p className="text-gray-300">
                Make informed trade-offs between shipping speed and cost for each order. SLA provides recommendations based on order priority, customer expectations, and cost constraints. Optimize your shipping mix to maximize value across all shipments.
              </p>
            </div>
          </div>
        </section>

        {/* Monitor Delivery Performance Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Monitor Delivery Performance</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">On-Time Delivery Rates</h3>
              <p className="text-gray-300">
                Track on-time delivery rates by carrier, route, and destination. Identify patterns in delays and work with underperforming carriers to improve service levels. Benchmark performance against industry standards and set targets for improvement.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">94.2%</div>
                  <div className="text-sm text-gray-400">On-Time Delivery</div>
                  <div className="text-xs text-gray-500 mt-1">+2.1% vs last month</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Damage and Loss Tracking</h3>
              <p className="text-gray-300">
                Monitor damage and loss rates across carriers, routes, and shipment types. Identify problem areas and take proactive measures to protect your inventory. Use historical data to negotiate better terms and insurance rates with carriers.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Cost Per Shipment Analysis</h3>
              <p className="text-gray-300">
                Track total cost per shipment including freight, handling, insurance, and associated fees. Compare costs across different carriers, routes, and modes of transportation. Identify cost optimization opportunities without compromising service quality.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">0.3%</div>
                  <div className="text-sm text-gray-400">Damage Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Industry avg: 1.2%</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Shipment Tracking</h3>
              <p className="text-gray-300">
                Get real-time visibility into all shipments across your supply chain. Track locations, estimated delivery times, and potential delays. Automatically update stakeholders when shipments deviate from planned schedules.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Customer Satisfaction Metrics</h3>
              <p className="text-gray-300">
                Monitor customer satisfaction with delivery performance. Track feedback, complaints, and delivery ratings to identify areas for improvement. Use customer insights to optimize logistics strategies and enhance the overall customer experience.
              </p>
            </div>
          </div>
        </section>

        {/* SLA's Live Insights Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">SLA's Live Insights</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Proactive Delay Predictions</h3>
              <p className="text-gray-300">
                Receive advance warning of potential delays based on historical data, weather patterns, port congestion, and carrier performance. Take corrective action before shipments are impacted, saving time and money while improving service levels.
              </p>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-red-400 mr-2">🚨</span>
                  <div>
                    <div className="font-semibold text-white mb-1">High Priority Alert</div>
                    <p className="text-gray-300 text-sm">Shipment #12847 at risk - Port congestion detected. Alternative: Air freight +$89, arrive 3 days earlier</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Alternative Routing Suggestions</h3>
              <p className="text-gray-300">
                Get intelligent recommendations for alternative routes when delays are detected or predicted. Evaluate trade-offs between different routing options, considering transit times, costs, and service levels. Automatically reroute shipments when conditions change.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Cost Optimization Recommendations</h3>
              <p className="text-gray-300">
                Receive actionable suggestions to reduce logistics costs without impacting service quality. Identify opportunities to consolidate shipments, switch carriers, modify routes, or adjust delivery schedules. Track actual savings achieved from implementing recommendations.
              </p>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Switch to Carrier B for Route LA→NYC: 8% cost reduction, same transit time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Risk Alerts for High-Priority Shipments</h3>
              <p className="text-gray-300">
                Get immediate alerts when high-priority or time-sensitive shipments face risks. Automatically escalate critical issues and suggest mitigation strategies. Ensure important shipments receive the extra attention they need to meet commitments.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">3</div>
                  <div className="text-sm text-gray-400">High-Priority Alerts</div>
                  <div className="text-xs text-gray-500 mt-1">Require attention</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Performance Benchmarking</h3>
              <p className="text-gray-300">
                Compare your logistics performance against industry benchmarks and best practices. Identify areas where you're underperforming and get specific recommendations for improvement. Track your progress over time and celebrate wins as performance improves.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Optimize Your Logistics?</h3>
            <p className="text-gray-300 mb-6">
              Experience how SLA's predictive logistics insights can transform your supply chain operations. Book a demo to see how we can help you find the right partners, plan better shipments, and monitor performance with AI-powered recommendations.
            </p>
            <BookDemoCTA 
              variant="primary"
              dataLocation="logistics-page"
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
