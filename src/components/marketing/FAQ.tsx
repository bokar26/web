"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How quickly can I see results with SLA?",
    answer: "Most customers see measurable cost savings within the first month. Our AI-powered supplier matching and routing optimization typically reduce landed costs by 20-30% within 90 days of implementation.",
  },
  {
    question: "What integrations does SLA support?",
    answer: "SLA integrates with popular ERP systems (SAP, Oracle, NetSuite), shipping platforms (FedEx, UPS, DHL), and e-commerce platforms (Shopify, WooCommerce). We also provide a comprehensive REST API for custom integrations.",
  },
  {
    question: "Is my data secure with SLA?",
    answer: "Yes, we take data security seriously. SLA is SOC 2 Type II certified, uses enterprise-grade encryption, and complies with GDPR and CCPA. Your data is never shared with third parties without explicit consent.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. You'll continue to have access to SLA until the end of your current billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day free trial with no credit card required. If you're not satisfied within the first 30 days of a paid subscription, we'll provide a full refund, no questions asked.",
  },
  {
    question: "What support options are available?",
    answer: "All plans include email support. Pro and Advanced plans include priority support with faster response times. Advanced customers get 24/7 phone support and a dedicated account manager.",
  },
  {
    question: "How accurate are the cost forecasts?",
    answer: "Our AI models achieve 95%+ accuracy in cost forecasting by analyzing historical data, market trends, and real-time factors like fuel prices and exchange rates. We continuously improve our models with new data.",
  },
  {
    question: "Can SLA handle international shipping?",
    answer: "Absolutely. SLA specializes in international supply chain optimization, handling complex requirements like customs clearance, duties calculation, and multi-modal transportation across 150+ countries.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="section bg-black">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-300">
            Get answers to common questions about SLA and how it can help optimize your supply chain.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/20 rounded-lg px-6 bg-neutral-900"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-gray-300 mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <button className="text-[#00FF7F] hover:opacity-90 font-medium">
            Contact our support team →
          </button>
        </div>
      </div>
    </section>
  )
}
