"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
]

const resourceLinks = [
  { name: "Documentation", href: "/docs" },
  { name: "API Reference", href: "/api" },
  { name: "Support", href: "/support" },
  { name: "Blog", href: "/blog" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    setIsSubscribed(true)
    setEmail("")
  }

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">SLA</div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Data-driven logistics & sourcing that cuts landed costs by 30% on average.
            </p>
            <div className="flex space-x-4">
              {/* Social links placeholder */}
              <div className="w-8 h-8 bg-ink-800 rounded-full flex items-center justify-center">
                <span className="text-xs">T</span>
              </div>
              <div className="w-8 h-8 bg-ink-800 rounded-full flex items-center justify-center">
                <span className="text-xs">L</span>
              </div>
              <div className="w-8 h-8 bg-ink-800 rounded-full flex items-center justify-center">
                <span className="text-xs">G</span>
              </div>
            </div>
          </div>

          {/* Menu Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-3">
              {menuLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-white/80 text-sm mb-4">
              Get the latest updates on supply chain optimization and cost reduction strategies.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-ink-800 border border-ink-700 rounded-md text-white placeholder-ink-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  Subscribe
                </Button>
              </form>
            ) : (
              <div className="text-emerald-400 text-sm">
                ✓ Thanks for subscribing!
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 SLA. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {resourceLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
