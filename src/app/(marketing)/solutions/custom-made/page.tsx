import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { BookDemoCTA } from "@/components/BookDemoCTA"

export default function CustomMadePage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16">
        <h1 className="text-4xl font-bold text-white">Custom Made</h1>
        <p className="mt-4 text-lg text-gray-300">
            Every client's dashboard is fully customized to their company's unique needs and evolving requirements. We work closely with you to build tailored solutions that adapt as your supply chain grows.
          </p>
        </div>

        {/* Tailored Design Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Tailored Design</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Company-Specific Dashboards</h3>
              <p className="text-gray-300">
                Your dashboard is built specifically for your business processes, data sources, and strategic objectives. No generic templates—every metric, KPI, and view is designed around your company's unique supply chain structure, workflows, and decision-making processes.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">100%</div>
                  <div className="text-sm text-gray-400">Custom Dashboards</div>
                  <div className="text-xs text-gray-500 mt-1">Built for your workflows</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Custom KPIs & Metrics</h3>
              <p className="text-gray-300">
                Define and track the metrics that matter most to your business. Whether you need custom calculations, specific industry KPIs, or proprietary formulas, we build exactly what you need to monitor performance and make informed decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Collaborative Implementation Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Collaborative Implementation</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">In-Depth Discovery Process</h3>
              <p className="text-gray-300">
                We work closely with you through comprehensive discovery meetings to understand your current processes, pain points, and goals. Our team spends time learning your business inside and out—how you source, how you plan inventory, how you monitor logistics—to build a solution that fits seamlessly into your operations.
              </p>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">Implementation Plan</div>
                    <p className="text-gray-300 text-sm">Week 1: Data integration + custom dashboard design. Week 2-3: Beta testing with your team. Week 4: Full deployment with training</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Continuous Check-Ins</h3>
              <p className="text-gray-300">
                Implementation is just the beginning. We provide continuous check-ins to ensure the platform meets your evolving needs. Regular feedback sessions, usage analytics, and optimization reviews help us identify improvements and new features that will drive even more value for your team.
              </p>
            </div>
          </div>
        </section>

        {/* Rapid Updates Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Rapid Updates</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Zero-Lag Implementation</h3>
              <p className="text-gray-300">
                New features and changes are implemented quickly with zero lag between request and deployment. No waiting weeks or months—when you need a new KPI, a different view, or a workflow adjustment, we build it and deploy it. Your platform evolves as fast as your business changes.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">48hr</div>
                  <div className="text-sm text-gray-400">Update Turnaround</div>
                  <div className="text-xs text-gray-500 mt-1">From request to live</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Maximum Flexibility</h3>
              <p className="text-gray-300">
                Every aspect of your dashboard can be customized—data sources, calculations, visualizations, alerts, and workflows. You're never locked into a rigid system. Whether you need to add new suppliers, change your cost model, or adjust how you track performance, we make it happen immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Data Integration Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Seamless Data Integration</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Connect Your Systems</h3>
              <p className="text-gray-300">
                Integrate with your existing ERP, inventory systems, supplier databases, and logistics platforms. We handle the technical complexity of data integration so you can focus on insights, not IT management. Your data flows seamlessly into your custom dashboard, updated in real-time.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Unified View</h3>
              <p className="text-gray-300">
                See all your supply chain data in one place, custom-formatted to your exact needs. No more switching between systems, no more manual data entry, no more disconnected spreadsheets. Everything you need to manage your supply chain is right where you need it.
              </p>
            </div>
          </div>
        </section>

        {/* Success Metrics Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Built for Your Success</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Performance Tracking</h3>
              <p className="text-gray-300">
                Track exactly what matters to your business with custom-built performance metrics. Monitor supplier reliability, inventory turnover, cost efficiency, delivery performance, and any other KPIs that drive your success.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Strategic Insights</h3>
              <p className="text-gray-300">
                Get AI-powered insights tailored to your business model. Our algorithms learn your patterns, your goals, and your constraints to provide recommendations that actually make sense for your unique situation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Custom Dashboard?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Let's discuss how we can create a tailored solution for your supply chain.
          </p>
          <BookDemoCTA 
            variant="primary" 
            dataLocation="custom-made-page"
            className="inline-block rounded-lg bg-[#00FF7F] px-8 py-3 text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Book a Demo
          </BookDemoCTA>
        </div>
      </main>
      <Footer />
    </div>
  )
}
