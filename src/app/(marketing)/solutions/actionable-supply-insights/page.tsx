import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { BookDemoCTA } from "@/components/BookDemoCTA"

export default function ActionableSupplyInsightsPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white">Actionable Supply Insights</h1>
        <p className="mt-4 text-lg text-gray-300">
            Transform raw supply chain data into clear, actionable recommendations. SLA analyzes your SKU, PO, shipment, and performance data across all metrics to surface opportunities and risks, providing visible foresight on how insights positively impact your system operations.
          </p>
        </div>

        {/* Real-Time Performance Monitoring Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Real-Time Performance Monitoring</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Comprehensive Metrics Tracking</h3>
              <p className="text-gray-300">
                Monitor all critical metrics across your supply chain in real-time: supplier performance, shipment tracking, inventory levels, cost trends, quality metrics, and delivery times. SLA provides a unified view of your entire supply chain ecosystem, giving you instant visibility into what's happening across all suppliers, warehouses, and logistics partners.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">15ms</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                  <div className="text-xs text-gray-500 mt-1">Real-time updates</div>
                </div>
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">99.8%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                  <div className="text-xs text-gray-500 mt-1">System availability</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Alert</div>
                    <p className="text-gray-300 text-sm">Supplier ABC delay detected: Shipment 14 days late, recommend expedited shipping or alternative carrier</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Automated Anomaly Detection</h3>
              <p className="text-gray-300">
                Get instant alerts when performance metrics deviate from normal patterns. SLA automatically identifies cost overruns, delivery delays, quality issues, and capacity constraints before they impact your operations. Proactive notifications help you address issues early and maintain supply chain resilience.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Continuous Performance Dashboards</h3>
              <p className="text-gray-300">
                Access live dashboards that update in real-time with supplier scores, shipping status, inventory levels, cost trends, and compliance metrics. Configure views specific to your role—executives see high-level KPIs, operations teams see detailed shipment tracking, and procurement teams see supplier performance data.
              </p>
            </div>
          </div>
        </section>

        {/* Predictive Analytics & Forecasting Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Predictive Analytics & Forecasting</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Demand Forecasting</h3>
              <p className="text-gray-300">
                Leverage AI-driven forecasts to predict demand with high accuracy, enabling better inventory planning, production scheduling, and procurement decisions. SLA analyzes historical sales, seasonal trends, market signals, and external factors to provide demand forecasts that help you stay ahead of market needs and avoid costly stockouts or overstock situations.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">94%</div>
                  <div className="text-sm text-gray-400">Forecast Accuracy</div>
                  <div className="text-xs text-gray-500 mt-1">Demand prediction</div>
                </div>
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">30 days</div>
                  <div className="text-sm text-gray-400">Lead Time</div>
                  <div className="text-xs text-gray-500 mt-1">Prediction window</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Forecast</div>
                    <p className="text-gray-300 text-sm">Demand surge predicted for SKU #1234 (+150% in 6 weeks) - recommend advance PO placement now</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Risk Identification & Mitigation</h3>
              <p className="text-gray-300">
                Identify potential risks before they materialize. SLA predicts stockouts, cost increases, supplier capacity issues, quality problems, and logistics disruptions. Early warning systems provide actionable insights to mitigate risks, ensuring continuity of supply and protecting your operations from unexpected disruptions.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Trend Analysis & Market Intelligence</h3>
              <p className="text-gray-300">
                Track cost trends, lead time patterns, supplier performance trends, and market conditions that impact your supply chain. SLA's trend analysis reveals opportunities to optimize costs, shorten lead times, improve quality, and capitalize on favorable market conditions when they arise.
              </p>
            </div>
          </div>
        </section>

        {/* Vendor Performance Scorecards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Vendor Performance Scorecards</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Dimensional Supplier Scoring</h3>
              <p className="text-gray-300">
                Evaluate supplier performance across quality, on-time delivery, cost competitiveness, communication, compliance, and collaboration. SLA's comprehensive scoring system provides a holistic view of supplier performance, helping you identify top performers, address underperformers, and make informed decisions about which suppliers to engage with.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">4.7/5.0</div>
                  <div className="text-sm text-gray-400">Avg Vendor Score</div>
                  <div className="text-xs text-gray-500 mt-1">Overall performance</div>
                </div>
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">12%</div>
                  <div className="text-sm text-gray-400">QoQ Improvement</div>
                  <div className="text-xs text-gray-500 mt-1">Performance trend</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Insight</div>
                    <p className="text-gray-300 text-sm">Supplier XYZ performance declining (3.2/5.0) - recommend renegotiation or alternative supplier evaluation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Comparative Supplier Analysis</h3>
              <p className="text-gray-300">
                Compare performance metrics across all your suppliers to identify best-in-class performers, leverage negotiation opportunities, and optimize your supplier portfolio. Side-by-side comparisons reveal which suppliers excel in specific areas and where improvement opportunities exist across your vendor network.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Actionable Improvement Recommendations</h3>
              <p className="text-gray-300">
                Receive specific recommendations for improving supplier relationships and performance. SLA suggests targeted actions such as renegotiating terms with high-performing vendors, implementing quality control measures with struggling suppliers, or diversifying your vendor base to reduce risk and improve reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Cost Optimization Insights Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Cost Optimization Insights</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Identified Cost Savings Opportunities</h3>
              <p className="text-gray-300">
                Discover significant cost-saving opportunities throughout your supply chain. SLA analyzes freight costs, supplier margins, packaging expenses, warehouse fees, customs duties, and other landed cost components to identify where costs can be reduced. Transparent cost breakdowns and market rate comparisons give you the data needed to negotiate better terms and make smarter sourcing decisions.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">$2.3M</div>
                  <div className="text-sm text-gray-400">Annual Savings</div>
                  <div className="text-xs text-gray-500 mt-1">Potential identified</div>
                </div>
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">18%</div>
                  <div className="text-sm text-gray-400">Cost Reduction</div>
                  <div className="text-xs text-gray-500 mt-1">Optimization opportunity</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Recommendation</div>
                    <p className="text-gray-300 text-sm">Switch SKU ABC to Supplier Y: Save $0.47/unit ($67K annually) with equivalent quality and better terms</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Landed Cost Analysis & Optimization</h3>
              <p className="text-gray-300">
                See complete landed cost breakdowns including product cost, freight, duties, warehousing, and handling fees. Understand where costs are accumulating and identify optimization opportunities. SLA helps you compare total landed costs across suppliers and shipping methods, ensuring you make decisions based on true cost, not just unit price.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">MOQ & Inventory Cost Analysis</h3>
              <p className="text-gray-300">
                Optimize minimum order quantities and reduce carrying costs. SLA analyzes MOQ requirements, demand patterns, and inventory levels to recommend the most cost-effective ordering strategies. Balance between bulk pricing discounts and inventory holding costs to minimize total cost while maintaining adequate stock levels.
              </p>
            </div>
          </div>
        </section>

        {/* Executive Dashboards & Reporting Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Executive Dashboards & Reporting</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Customizable Executive Views</h3>
              <p className="text-gray-300">
                Access tailored dashboards that provide executives with the KPIs that matter most to their business. Monitor supply chain health, cost trends, vendor performance, risk levels, and strategic metrics in one consolidated view. Configure role-based dashboards to show relevant information for different stakeholders.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F">25+</div>
                  <div className="text-sm text-gray-400">KPI Metrics</div>
                  <div className="text-xs text-gray-500 mt-1">Apparel specific</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Board-Ready Reports</h3>
              <p className="text-gray-300">
                Generate export-ready reports for board meetings, investor presentations, and strategic planning sessions. SLA provides comprehensive reports covering supply chain performance, cost optimization results, risk assessments, vendor performance, and strategic recommendations in professional formats that stakeholders can easily understand and act upon.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Industry-Specific KPIs</h3>
              <p className="text-gray-300">
                Track metrics that are particularly relevant to apparel and retail businesses including SKU-level performance, seasonality impact, supplier lead times, quality inspection rates, return rates, and sustainability metrics. SLA understands industry nuances and provides insights tailored to your specific business context.
              </p>
            </div>
          </div>
        </section>

        {/* Actionable Recommendations Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Actionable Recommendations</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Daily Insight Delivery</h3>
              <p className="text-gray-300">
                Receive prioritized, actionable recommendations delivered to your team on a daily basis. SLA analyzes your data continuously and surfaces the most important insights, opportunities, and risks that require your attention. Focus on what matters most with context-aware recommendations that align with your business goals.
              </p>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">Today's Top Insight</div>
                    <p className="text-gray-300 text-sm">Expedite PO #9823: 85% of similar orders delivered 3+ days late by current supplier</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Impact-Prioritized Action Items</h3>
              <p className="text-gray-300">
                Get recommendations ranked by potential impact on your operations. SLA prioritizes actions that will deliver the most significant benefits—whether that's cost reduction, improved delivery times, risk mitigation, or quality enhancement. Understand the expected ROI of each recommendation before taking action.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Workflow Integration</h3>
              <p className="text-gray-300">
                Integrate SLA's insights seamlessly into your existing workflows. Recommendations can trigger actions in your ERP, procurement systems, and logistics platforms. Automate follow-ups, approvals, and reporting to ensure insights translate into actual improvements in your supply chain operations.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Visible Impact on Operations</h3>
              <p className="text-gray-300">
                Track the positive impact of following SLA's recommendations. See how implementing suggestions reduces costs, improves on-time delivery, mitigates risks, and enhances overall supply chain performance. Quantified results demonstrate the value of data-driven decision-making and continuous improvement.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Supply Chain Insights?</h3>
            <p className="text-gray-300 mb-6">
              Experience how SLA's real-time monitoring, predictive analytics, vendor scorecards, cost optimization insights, executive dashboards, and actionable recommendations can provide visible foresight and drive positive impact across your entire supply chain system.
            </p>
            <BookDemoCTA 
              variant="primary"
              dataLocation="supply-insights-page"
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
