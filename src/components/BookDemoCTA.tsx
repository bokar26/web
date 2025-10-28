"use client"

import Link from "next/link"
import { getBookDemoHref } from "@/lib/cta"
import { Button } from "@/components/ui/button"
import { ComponentProps } from "react"

interface BookDemoCTAProps {
  variant?: "primary" | "secondary" | "link"
  children?: React.ReactNode
  className?: string
  dataLocation?: string
  onClick?: () => void
}

/**
 * Standardized CTA component for booking a demo
 * - Always links to /book-demo with UTM params
 * - Adds analytics attributes
 * - Maintains consistent styling
 */
export function BookDemoCTA({
  variant = "primary",
  children = "Book a Demo",
  className = "",
  dataLocation,
  onClick,
}: BookDemoCTAProps) {
  const href = getBookDemoHref()

  // Handle click with optional analytics
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    
    // Optional: emit analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "cta_click", {
        cta_type: "book_demo",
        location: dataLocation || "unknown",
      })
    }
  }

  // Variant-specific base classes
  const variantClasses = {
    primary: "bg-[#00FF7F] text-black hover:brightness-95 font-semibold px-8 py-3 rounded-lg transition-all",
    secondary: "bg-transparent border-2 border-[#00FF7F] text-[#00FF7F] hover:bg-[#00FF7F] hover:text-black font-semibold px-8 py-3 rounded-lg transition-all",
    link: "text-[#00FF7F] hover:brightness-110 underline transition-all",
  }

  // If using Button component for primary/secondary
  if (variant === "primary" || variant === "secondary") {
    return (
      <Link
        href={href}
        data-cta="book-demo"
        data-location={dataLocation}
        aria-label="Book a demo"
        onClick={handleClick}
        className="inline-block"
      >
        <Button
          className={className || variantClasses[variant]}
        >
          {children}
        </Button>
      </Link>
    )
  }

  // Link variant
  return (
    <Link
      href={href}
      data-cta="book-demo"
      data-location={dataLocation}
      aria-label="Book a demo"
      onClick={handleClick}
      className={className || variantClasses.link}
    >
      {children}
    </Link>
  )
}

