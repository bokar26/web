"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { env } from "@/lib/env"
import { getCalFallbackUrl } from "@/lib/cta"

// Define the form schema
const bookDemoSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  work_email: z.string().email("Valid email is required"),
  company: z.string().min(2, "Company is required"),
  role: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  team_size: z.string().optional(),
  skus: z.string().optional(),
  erp: z.string().optional(),
  use_case_notes: z.string().max(2000, "Notes must be less than 2000 characters").optional(),
  consent: z.boolean().refine(val => val === true, "You must consent to continue"),
  // UTM params (auto-populated)
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  // Honeypot (must be empty)
  middle_name: z.string().max(0, "Invalid submission"),
})

type BookDemoFormData = z.infer<typeof bookDemoSchema>

interface TurnstileInstance {
  render: (container: string, options: { sitekey: string }) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

export function BookDemoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [scheduleUrl, setScheduleUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)
  const captchaRef = useRef<any>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const turnstileLoaded = useRef(false)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BookDemoFormData>({
    resolver: zodResolver(bookDemoSchema),
  })

  // Load Turnstile script and capture UTM params on mount
  useEffect(() => {
    // Capture UTM parameters from URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      setValue("utm_source", urlParams.get("utm_source") || "")
      setValue("utm_medium", urlParams.get("utm_medium") || "")
      setValue("utm_campaign", urlParams.get("utm_campaign") || "")
      setValue("utm_term", urlParams.get("utm_term") || "")
      setValue("utm_content", urlParams.get("utm_content") || "")
    }

    // Load Turnstile if site key is present
    if (env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileLoaded.current) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        turnstileLoaded.current = true
        const turnstile = (window as any).turnstile
        if (turnstile && captchaRef.current) {
          turnstileWidgetId.current = turnstile.render(captchaRef.current, {
            sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          })
        }
      }
      document.body.appendChild(script)
    }
  }, [setValue])

  const onSubmit = async (data: BookDemoFormData) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    setSubmitStatus('idle')

    try {
      // Get CAPTCHA token
      let captchaToken = "test" // Default for local dev or no CAPTCHA

      if (env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (window as any).turnstile) {
        const turnstile = (window as any).turnstile
        if (turnstileWidgetId.current) {
          const response = turnstile.getResponse(turnstileWidgetId.current)
          if (response) {
            captchaToken = response
          }
        }
      }

      // Prepare payload
      const payload = {
        ...data,
        captchaToken,
      }

      // POST to edge function
      const ingestUrl = env.EDGE_DEMO_INGEST_URL || '/api/dev/echo'
      const response = await fetch(ingestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()

      if (result.ok && result.scheduleUrl) {
        setScheduleUrl(result.scheduleUrl)
        setSubmitStatus('success')
        
        // Reset form
        if (turnstileWidgetId.current && (window as any).turnstile) {
          (window as any).turnstile.reset(turnstileWidgetId.current)
        }
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      setErrorMessage(error.message || 'An error occurred. Please try again.')
      setSubmitStatus('error')
      
      // Generate fallback Cal.com URL with pre-filled data
      const formData = getValues()
      const fallback = getCalFallbackUrl(formData.full_name, formData.work_email)
      setFallbackUrl(fallback)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Warning banner for missing environment */}
      {!env.EDGE_DEMO_INGEST_URL && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg mb-6">
          <p className="text-sm text-yellow-400 mb-2">
            Demo submission endpoint not configured. You can still schedule directly:
          </p>
          <a
            href="https://cal.com/sla-ta5bec"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00FF7F] text-black px-4 py-2 rounded-lg font-semibold hover:brightness-95 transition-all text-sm"
          >
            Schedule on Cal.com
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden honeypot field */}
        <input
          type="text"
          {...register("middle_name")}
          autoComplete="off"
          tabIndex={-1}
          className="sr-only"
        />

        {/* Required fields */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="full_name"
            type="text"
            {...register("full_name")}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
            placeholder="John Doe"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="work_email" className="block text-sm font-medium text-gray-300 mb-1">
            Work Email <span className="text-red-400">*</span>
          </label>
          <input
            id="work_email"
            type="email"
            {...register("work_email")}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
            placeholder="john@company.com"
          />
          {errors.work_email && (
            <p className="mt-1 text-sm text-red-400">{errors.work_email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
            Company <span className="text-red-400">*</span>
          </label>
          <input
            id="company"
            type="text"
            {...register("company")}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
            placeholder="Acme Inc"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-400">{errors.company.message}</p>
          )}
        </div>

        {/* Optional fields */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
            Role
          </label>
          <input
            id="role"
            type="text"
            {...register("role")}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
            placeholder="VP of Operations"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
            Website
          </label>
          <input
            id="website"
            type="url"
            {...register("website")}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
            placeholder="https://company.com"
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-400">{errors.website.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="team_size" className="block text-sm font-medium text-gray-300 mb-1">
              Team Size
            </label>
            <input
              id="team_size"
              type="text"
              {...register("team_size")}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
              placeholder="50-100"
            />
          </div>

          <div>
            <label htmlFor="skus" className="block text-sm font-medium text-gray-300 mb-1">
              SKUs/Products
            </label>
            <input
              id="skus"
              type="text"
              {...register("skus")}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
              placeholder="100-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="erp" className="block text-sm font-medium text-gray-300 mb-1">
            Current ERP/Systems
          </label>
          <input
            id="erp"
            type="text"
            {...register("erp")}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
            placeholder="SAP, NetSuite, etc."
          />
        </div>

        <div>
          <label htmlFor="use_case_notes" className="block text-sm font-medium text-gray-300 mb-1">
            Use Case / Notes
          </label>
          <textarea
            id="use_case_notes"
            rows={4}
            {...register("use_case_notes")}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
            placeholder="Tell us about your supply chain challenges..."
          />
          {errors.use_case_notes && (
            <p className="mt-1 text-sm text-red-400">{errors.use_case_notes.message}</p>
          )}
        </div>

        {/* CAPTCHA */}
        {env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <div ref={captchaRef} className="flex justify-center" />
        ) : (
          <div className="text-center text-gray-500 text-sm">
            CAPTCHA not configured (dev mode)
          </div>
        )}

        {/* Consent checkbox */}
        <div className="flex items-start gap-2">
          <input
            id="consent"
            type="checkbox"
            {...register("consent")}
            className="mt-1"
          />
          <label htmlFor="consent" className="text-sm text-gray-300">
            I consent to being contacted by SLA regarding my demo request.{" "}
            <span className="text-red-400">*</span>
          </label>
        </div>
        {errors.consent && (
          <p className="text-sm text-red-400">{errors.consent.message}</p>
        )}

        {/* Error message with fallback */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg space-y-3">
            <p className="text-sm text-red-400">{errorMessage}</p>
            {fallbackUrl && (
              <div className="pt-2">
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#00FF7F] text-black px-4 py-2 rounded-lg font-semibold hover:brightness-95 transition-all text-sm"
                >
                  Schedule Directly on Cal.com
                </a>
              </div>
            )}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00FF7F] text-black px-6 py-3 rounded-lg font-semibold hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Request Demo'}
        </button>
      </form>

      {/* Success state with scheduler */}
      {submitStatus === 'success' && scheduleUrl && (
        <div className="mt-8 p-6 bg-green-500/10 border border-green-500 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Request received!</h3>
          </div>
          <p className="text-gray-300">
            We've received your request. Click below to schedule your demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={scheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#00FF7F] text-black px-6 py-3 rounded-lg font-semibold hover:brightness-95 transition-all text-center"
            >
              Pick a Time
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

