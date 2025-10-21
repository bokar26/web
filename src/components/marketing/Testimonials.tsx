"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "SLA reduced our landed costs by 28% in the first quarter. The supplier matching is incredibly accurate and the routing optimization saved us weeks of manual work.",
    author: "Sarah Chen",
    role: "Supply Chain Director",
    company: "TechFlow Inc.",
    avatar: "/images/testimonials/sarah.jpg",
    rating: 5,
  },
  {
    quote: "The transparency in cost forecasting is a game-changer. We can now make informed decisions about suppliers and routes before committing to any shipment.",
    author: "Michael Rodriguez",
    role: "Operations Manager", 
    company: "Global Retail Co.",
    avatar: "/images/testimonials/michael.jpg",
    rating: 5,
  },
  {
    quote: "Integration was seamless with our existing ERP system. The API is well-documented and the support team helped us get up and running quickly.",
    author: "Emily Johnson",
    role: "IT Director",
    company: "Manufacturing Plus",
    avatar: "/images/testimonials/emily.jpg",
    rating: 5,
  },
  {
    quote: "We've cut our shipping time from 12 days to 8 days on average while maintaining cost efficiency. The AI recommendations are spot-on every time.",
    author: "David Kim",
    role: "Logistics Coordinator",
    company: "E-commerce Solutions",
    avatar: "/images/testimonials/david.jpg",
    rating: 5,
  },
  {
    quote: "The analytics dashboard gives us insights we never had before. We can now track performance across all our suppliers and routes in real-time.",
    author: "Lisa Thompson",
    role: "Procurement Manager",
    company: "Consumer Goods Ltd.",
    avatar: "/images/testimonials/lisa.jpg",
    rating: 5,
  },
  {
    quote: "SLA's supplier matching found us three new vendors that we never would have discovered. The quality is excellent and the prices are 15% better than our previous suppliers.",
    author: "James Wilson",
    role: "Sourcing Specialist",
    company: "Fashion Forward",
    avatar: "/images/testimonials/james.jpg",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 mb-6">
            Loved by people worldwide
          </h2>
          <p className="text-lg sm:text-xl text-ink-600 max-w-3xl mx-auto">
            Join thousands of businesses that trust SLA to optimize their supply chain operations and reduce costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200 border-ink-200 hover:border-emerald-200 bg-white"
            >
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-ink-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-semibold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-ink-600">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-emerald-600 font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">
              1,000+
            </div>
            <div className="text-ink-600">Active users</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">
              30%
            </div>
            <div className="text-ink-600">Average cost reduction</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">
              4.9/5
            </div>
            <div className="text-ink-600">Customer satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
