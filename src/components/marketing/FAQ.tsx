import { BookDemoCTA } from "@/components/BookDemoCTA"

export function FAQ() {
  return (
    <section id="faq" className="section bg-black py-20">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Simplify your supply chain. SLA
          </p>
          <BookDemoCTA 
            variant="primary"
            dataLocation="faq-cta"
            className="inline-block bg-[#00FF7F] text-black px-8 py-4 rounded-lg font-semibold hover:brightness-95 transition-all text-lg"
          >
            Book a Demo
          </BookDemoCTA>
        </div>
      </div>
    </section>
  )
}
