// Utility functions for standardized CTA behavior and UTM propagation

/**
 * Extracts UTM parameters from URL and builds a search string
 * @param fromLocation - The current window.location object
 * @returns Formatted search string with UTM params and ref
 */
export function buildUtmSearch(fromLocation?: Location): string {
  if (typeof window === "undefined" || !fromLocation) {
    return ""
  }

  const params = new URLSearchParams(fromLocation.search)
  const utmParams = new URLSearchParams()

  // Extract UTM parameters
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
  utmKeys.forEach((key) => {
    const value = params.get(key)
    if (value) {
      utmParams.set(key, value)
    }
  })

  // Add ref parameter with current pathname if not already present
  if (!utmParams.has("ref") && fromLocation.pathname !== "/") {
    utmParams.set("ref", fromLocation.pathname)
  }

  const searchString = utmParams.toString()
  return searchString ? `?${searchString}` : ""
}

/**
 * Builds the book demo href with UTM parameters
 * @param _currentURL - Optional current URL string for SSR safety (unused)
 * @returns Book demo path with UTM search params
 */
export function getBookDemoHref(_currentURL?: string): string {
  // Server-side default
  if (typeof window === "undefined") {
    return "/book-demo"
  }

  const utmSearch = buildUtmSearch(window.location)
  return `/book-demo${utmSearch}`
}

/**
 * Builds a direct Cal.com fallback URL
 * @param name - Optional name to pre-fill
 * @param email - Optional email to pre-fill
 * @returns Cal.com URL with optional query params
 */
export function getCalFallbackUrl(name?: string, email?: string): string {
  const baseUrl = "https://cal.com/sla-ta5bec"
  
  if (!name && !email) {
    return baseUrl
  }

  const params = new URLSearchParams()
  if (name) {
    params.set("name", name)
  }
  if (email) {
    params.set("email", email)
  }

  return `${baseUrl}?${params.toString()}`
}

