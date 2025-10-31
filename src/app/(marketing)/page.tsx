import { Navbar } from "@/components/marketing/Navbar"
import { Hero } from "@/components/marketing/Hero"
import StatsRow from "@/components/marketing/StatsRow"
import { Problem } from "@/components/marketing/Problem"
import { TabsShowcaseSection } from "@/components/marketing/TabsShowcaseSection"
import { About } from "@/components/marketing/About"
import { Footer } from "@/components/marketing/Footer"

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <StatsRow />
        <TabsShowcaseSection />
        <About />
      </main>
      <Footer />
    </div>
  )
}
