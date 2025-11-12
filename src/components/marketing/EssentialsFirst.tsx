import { Upload, Database, Eye, Zap } from "lucide-react"

export function EssentialsFirst() {
  const benefits = [
    {
      icon: Upload,
      title: "Easy Data Upload",
      description: "Seamlessly upload unstructured supplier, SKU, product, and finance data without complex formatting."
    },
    {
      icon: Database,
      title: "Simple, Manageable Format",
      description: "Access and view all your data in a clean, organized format that makes sense."
    },
    {
      icon: Eye,
      title: "Enhanced Visibility",
      description: "Less time searching, more time acting. Find what you need instantly and make informed decisions."
    },
    {
      icon: Zap,
      title: "AI/ML Ready",
      description: "Your organized data is ready for optimization with our advanced AI and ML models when you're ready."
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-left mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Execute on Essentials
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Run your entire supply chain from one connected platform.
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto mb-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Run every part of your daily operations from one unified system—plan, move, and manage your supply chain with seamless coordination across data, teams, and workflows.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Upload supplier, product, and financial data instantly, then manage orders, inventory, and logistics in real time—without juggling disconnected tools. Every process, update, and transaction stays synced and automated.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Our AI and ML models continuously optimize performance, reducing friction and eliminating repetitive work so your team can focus on execution, not administration.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#00FF7F]/20">
                    <Icon className="h-5 w-5 text-[#00FF7F]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    {benefit.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            <span className="font-semibold text-white">spend time building, not backend</span>
          </p>
        </div>
      </div>
    </section>
  )
}

