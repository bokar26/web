"use client"

import Link from "next/link"
import { navigationLinks } from "@/lib/navigation"
import { BookDemoCTA } from "@/components/BookDemoCTA"

export function Footer() {
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
        {/* Brand and CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
          {/* Left: Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">SLA</div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Driven by the world's most precise optimization models
            </p>
            <div className="flex space-x-4">
              {/* Social links placeholder */}
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">T</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">L</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">G</span>
              </div>
            </div>
          </div>

          {/* Right: CTA Column */}
          <div className="flex flex-col items-start md:items-end space-y-4">
            <p className="text-white/80 text-sm">
              Simplify your supply chain. SLA
            </p>
            <BookDemoCTA 
              variant="primary"
              dataLocation="footer"
              className="inline-block bg-[#00FF7F] text-black px-6 py-3 rounded-lg font-semibold hover:brightness-95 transition-all text-sm"
            >
              Book a Demo
            </BookDemoCTA>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Menu items */}
          <div className="flex flex-wrap gap-4 md:gap-6">
            {navigationLinks.map((link) => (
              <div key={link.name}>
                {link.href === "/#testimonials" ? (
                  <Link
                    href="/"
                    onClick={(e) => {
                      if (typeof window !== "undefined" && window.location.pathname === "/") {
                        e.preventDefault()
                        scrollToSection("#testimonials")
                      }
                    }}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : link.href.startsWith("#") ? (
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Center: Copyright */}
          <p className="text-white/60 text-sm">
            © 2025 SLA. All rights reserved.
          </p>

          {/* Right: Legal links */}
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
