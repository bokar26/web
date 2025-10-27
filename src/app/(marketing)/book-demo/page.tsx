"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react"

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    companyName: "",
    industry: "",
    companySize: "",
    primaryUseCase: "",
    additionalNotes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.companyName.trim() !== "" &&
      formData.industry !== "" &&
      formData.companySize !== "" &&
      formData.primaryUseCase.trim() !== ""
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call - in production, this will connect to Supabase
    try {
      console.log("Form data:", formData)
      
      // TODO: Replace with Supabase integration
      // await submitToSupabase(formData)
      
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-neutral-900 to-black border-white/10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#00FF7F]" />
            </div>
            <CardTitle className="text-2xl text-white">Thank You!</CardTitle>
            <CardDescription className="text-gray-300">
              Your demo request has been received. We'll reach out shortly to schedule your demo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-sm text-gray-300 mb-2">What happens next?</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">✓</span>
                  <span>We'll review your requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">✓</span>
                  <span>Our team will contact you within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">✓</span>
                  <span>We'll schedule a personalized demo</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                asChild
                className="w-full bg-[#00FF7F] text-black hover:bg-[#00FF7F]/90"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsSubmitted(false)}
                className="text-gray-400 hover:text-white"
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-[#00FF7F] transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Book a Demo
            </h1>
            <p className="text-gray-400 text-lg">
              Let's show you how SLA can transform your supply chain operations
            </p>
          </div>

          <Card className="bg-gradient-to-br from-neutral-900 to-black border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Get Started</CardTitle>
              <CardDescription className="text-gray-400">
                Fill out the form below and our team will reach out to schedule your personalized demo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-300">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="john@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-gray-300">
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleChange("jobTitle", e.target.value)}
                        placeholder="Supply Chain Manager"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Company Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-gray-300">
                        Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        placeholder="Acme Corp"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-gray-300">
                        Industry *
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => handleChange("industry", value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10">
                          <SelectItem value="apparel">Apparel & Fashion</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="food">Food & Beverage</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="companySize" className="text-gray-300">
                        Company Size *
                      </Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) => handleChange("companySize", value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10">
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Requirements
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="primaryUseCase" className="text-gray-300">
                      Primary Use Case *
                    </Label>
                    <Textarea
                      id="primaryUseCase"
                      value={formData.primaryUseCase}
                      onChange={(e) => handleChange("primaryUseCase", e.target.value)}
                      placeholder="Tell us about your supply chain challenges and how SLA can help..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-32"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes" className="text-gray-300">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleChange("additionalNotes", e.target.value)}
                      placeholder="Any other information you'd like to share?"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-24"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00FF7F] text-black hover:bg-[#00FF7F]/90 font-semibold py-6 text-lg"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Request Demo
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our terms of service and privacy policy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
