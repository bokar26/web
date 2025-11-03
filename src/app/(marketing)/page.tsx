"use client"

import dynamic from "next/dynamic"
import { Hero } from "@/components/marketing/Hero"
import StatsRow from "@/components/marketing/StatsRow"
import { Problem } from "@/components/marketing/Problem"
import { EssentialsFirst } from "@/components/marketing/EssentialsFirst"
import { TabsShowcaseSection } from "@/components/marketing/TabsShowcaseSection"
import { About } from "@/components/marketing/About"
import { Footer } from "@/components/marketing/Footer"

const Navbar = dynamic(() => import("@/components/marketing/Navbar").then(mod => ({ default: mod.Navbar })), {
  ssr: false,
  loading: () => (
    <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-sm rounded-b-xl">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-14 items-center justify-between">
          <div className="text-2xl font-bold text-white">SLA</div>
          <div className="w-8 h-8 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </nav>
  ),
})

export default function Home() {
  return (
    <div>
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
