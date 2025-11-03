import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16">
          {/* Left: Mission Content */}
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              At SLA, we partner with clients to leverage cutting-edge AI and ML models that optimize supply chains across cost, sustainability, speed, and reliability. Our platform continuously learns from real-time data to deliver predictive insights and intelligent, context-aware suggestions that drive measurable results.
            </p>
            <Link 
              href="/about" 
              className="inline-flex items-center text-[#00FF7F] hover:brightness-110 transition-all"
            >
              Read more <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {/* Right: Testimonial */}
          <div className="flex items-start lg:pt-16">
            <div className="w-full">
              <figure className="rounded-lg border border-white/20 bg-neutral-900 p-8 shadow-sm">
                <blockquote className="text-xl leading-relaxed text-white">
                  &ldquo;SLA's AI-driven planning helped us reduce overall cost and shipping speed with the increased traspanrecy and forecasting accuracy. We finally see true, predictive cost data before every order.&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm text-gray-300">
                  — smpl
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}