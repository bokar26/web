import { Navbar } from "@/components/marketing/Navbar"
import { Hero } from "@/components/marketing/Hero"
import StatsRow from "@/components/marketing/StatsRow"
import { Problem } from "@/components/marketing/Problem"
import { ApparelSection } from "@/components/marketing/ApparelSection"
import { TestimonialOne } from "@/components/marketing/TestimonialOne"
import { FAQ } from "@/components/marketing/FAQ"
import { Footer } from "@/components/marketing/Footer"
import { MobileStickyCTA } from "@/components/marketing/MobileStickyCTA"

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <StatsRow />
        <ApparelSection />
        <TestimonialOne />
        <FAQ />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  )
}
