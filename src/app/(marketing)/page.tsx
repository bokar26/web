"use client"

import { Hero } from "@/components/marketing/Hero"
import StatsRow from "@/components/marketing/StatsRow"
import { Problem } from "@/components/marketing/Problem"
import { EssentialsFirst } from "@/components/marketing/EssentialsFirst"
import { TabsShowcaseSection } from "@/components/marketing/TabsShowcaseSection"
import { About } from "@/components/marketing/About"
import { Footer } from "@/components/marketing/Footer"
import { Navbar } from "@/components/marketing/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <StatsRow />
        <EssentialsFirst />
        <TabsShowcaseSection />
        <About />
      </main>
      <Footer />
    </div>
  )
}
