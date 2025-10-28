import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <main className="bg-black min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-12">
            Our Mission
          </h1>
          <div className="space-y-8 text-left">
            <p className="text-lg text-gray-300 leading-relaxed">
              Our mission is to work as closely as possible with our clients to leverage our advanced optimization models to accurately and efficiently hit their supply chain targets and goals across all areas—from cost reduction and eco-friendliness to speed and reliability.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              We employ cutting-edge machine learning models that continuously learn from your supply chain data, market conditions, and industry trends. Our AI-powered platform analyzes millions of data points in real-time to provide actionable insights and recommendations tailored specifically to your business needs.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Beyond traditional analytics, we integrate advanced AI reasoning to deliver intelligent, context-aware suggestions directly within your dashboard. Our system doesn't just report what happened—it understands why it happened and what you should do next. From identifying cost-saving opportunities to predicting potential delays, our AI continuously monitors your operations and surfaces the most impactful recommendations for faster decision-making and optimization across every aspect of your supply chain.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Every supply chain is unique, and we recognize that one-size-fits-all solutions don't work. That's why our platform is built for complete customization and flexibility. Whether you need to optimize for cost, speed, sustainability, risk mitigation, or any combination of factors, our models adapt to your specific requirements and priorities. You define the targets, and we build the solution to achieve them.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              We don't just provide software—we partner with you to understand your challenges, constraints, and goals. Our team works alongside yours to configure models, refine algorithms, and ensure that every insight delivered drives measurable value for your organization.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
