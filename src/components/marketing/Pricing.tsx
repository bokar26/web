"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Contact us for pricing",
    period: "",
    description: "Perfect for small businesses getting started with supply chain optimization",
    features: [
      "Up to 50 shipments/month",
      "Basic supplier matching",
      "Standard routing optimization",
      "Email support",
      "Basic analytics dashboard",
      "API access (limited)",
    ],
    cta: "Speak with our team",
    popular: false,
  },
  {
    name: "Pro",
    price: "Contact us for pricing",
    period: "",
    description: "Most popular for growing businesses with complex supply chains",
    features: [
      "Up to 500 shipments/month",
      "Advanced AI supplier matching",
      "Multi-modal routing optimization",
      "Priority support",
      "Advanced analytics & reporting",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Speak with our team",
    popular: true,
  },
  {
    name: "Advanced",
    price: "Contact us for pricing",
    period: "",
    description: "Enterprise-grade solution for large-scale operations",
    features: [
      "Unlimited shipments",
      "Custom AI models",
      "White-label solution",
      "24/7 phone support",
      "Custom analytics & dashboards",
      "Enterprise API access",
      "On-premise deployment",
      "SLA guarantees",
      "Custom training & onboarding",
    ],
    cta: "Speak with our team",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-ink-50 dark:bg-ink-900/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-ink-50 mb-6">
            Pricing tailored to your team
          </h2>
          <p className="text-lg sm:text-xl text-ink-600 dark:text-ink-300 max-w-3xl mx-auto">
            Every supply chain is unique. Explore features below, then speak with our team for tailored pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-200 hover:shadow-lg bg-white dark:bg-ink-800/50 ${
                plan.popular
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 scale-105"
                  : "border-ink-200 dark:border-ink-700 hover:border-emerald-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <h3 className="text-2xl font-bold text-ink-900 dark:text-ink-50 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-ink-900 dark:text-ink-50">
                    {plan.price}
                  </span>
                  <span className="text-ink-600 dark:text-ink-300 ml-1">{plan.period}</span>
                </div>
                <p className="text-ink-600 dark:text-ink-300 mt-4">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-ink-600 dark:text-ink-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-ink-900 hover:bg-ink-800"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <p className="text-center text-sm text-ink-500 dark:text-ink-400">
                  All features included • No hidden fees
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-ink-600 dark:text-ink-300 mb-4">
            14-day free trial available • No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
