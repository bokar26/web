"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { navigationLinks } from "@/lib/navigation"

const navigation = [
  { ...navigationLinks.find(link => link.name === "Solutions")!, hasDropdown: true },
  { ...navigationLinks.find(link => link.name === "Mission")! },
  { ...navigationLinks.find(link => link.name === "Testimonials")! },
] as Array<{ name: string; href: string; hasDropdown?: boolean }>

const solutionsDropdown = [
  { name: "Procurement", href: "/solutions/procurement" },
  { name: "Inventory Management", href: "/solutions/inventory-management" },
  { name: "Predictive logistics insights", href: "/solutions/predictive-logistics-insights" },
  { name: "Actionable supply insights", href: "/solutions/actionable-supply-insights" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false)
    
    // If href contains a hash fragment (e.g., /#testimonials)
    if (href.includes('#')) {
      const hash = href.substring(href.indexOf('#'))
      
      // If on homepage, scroll immediately
      if (pathname === '/') {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
        return
      }
      
      // If not on homepage, navigate to / first, then scroll after a delay
      router.push('/')
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
      return
    }
    
    // If href is just a page path without hash, navigate to it
    if (href.startsWith('/')) {
      router.push(href)
      return
    }
    
    // Fallback: try as a CSS selector (for pure hash fragments like #testimonials)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 bg-black/50 backdrop-blur-sm rounded-b-xl ${
        isScrolled
          ? "bg-black/70 shadow-md"
          : "bg-black/50"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-white">SLA</div>
            <div className="flex flex-col text-xs font-medium text-white/80 leading-tight">
              <span>supply</span>
              <span>simplified</span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <div key={item.name} className="relative group">
                  <Link 
                    href={item.href} 
                    prefetch
                    className="text-sm font-medium text-white hover:text-[#00FF7F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] rounded-md"
                  >
                    {item.name}
                  </Link>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 mt-3 w-72 rounded-xl border border-white/20 bg-neutral-900 shadow-lg p-2 z-50">
                    {solutionsDropdown.map((solution) => (
                      <Link
                        key={solution.name}
                        href={solution.href}
                        prefetch
                        className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F]"
                      >
                        {solution.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-white hover:text-[#00FF7F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] rounded-md"
                >
                  {item.name}
                </button>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <Link href="/book-demo" prefetch>
                <Button size="sm" className="bg-[#00FF7F] text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            
            <SignedIn>
              {!isLoaded ? (
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
              ) : (
                <>
                  <Link 
                    href="/dashboard" 
                    prefetch
                    className="text-sm text-gray-300 hover:text-[#00FF7F] transition-colors"
                  >
                    Hi, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                  </Link>
                  <SignOutButton>
                    <Button size="sm" className="bg-[#00FF7F] text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform">
                      Logout
                    </Button>
                  </SignOutButton>
                </>
              )}
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="text-left text-lg font-medium text-white hover:text-[#00FF7F] transition-colors py-2"
                    >
                      {item.name}
                    </button>
                  ))}
                  <div className="pt-4 border-t">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button variant="ghost" className="w-full mb-4">
                          Sign In
                        </Button>
                      </SignInButton>
                      <Link href="/book-demo" prefetch>
                        <Button className="w-full bg-[#00FF7F] text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform">
                          Get Started
                        </Button>
                      </Link>
                    </SignedOut>
                    
                    <SignedIn>
                      {!isLoaded ? (
                        <div className="w-full h-8 bg-gray-200 animate-pulse rounded mb-4" />
                      ) : (
                        <>
                          <Link 
                            href="/dashboard" 
                            prefetch
                            className="mb-4 p-2 bg-white/10 rounded text-sm text-gray-300 hover:text-[#00FF7F] transition-colors block"
                          >
                            Hi, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                          </Link>
                          <SignOutButton>
                            <Button className="w-full bg-[#00FF7F] text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform">
                              Logout
                            </Button>
                          </SignOutButton>
                        </>
                      )}
                    </SignedIn>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
