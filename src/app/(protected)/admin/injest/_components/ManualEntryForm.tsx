"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { vendorCreateSchema, type VendorCreateInput } from "../schemas"
import { createVendor } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ManualEntryFormProps {
  onSuccess?: () => void
}

export function ManualEntryForm({ onSuccess }: ManualEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendorCreateInput>({
    resolver: zodResolver(vendorCreateSchema),
    defaultValues: {
      name: '',
      category: '',
      location: '',
      email: '',
      phone: '',
      website: '',
      notes: '',
    },
  })

  const onSubmit = async (data: VendorCreateInput) => {
    setIsSubmitting(true)
    try {
      // Convert empty strings to null for optional fields
      const vendorData = {
        name: data.name,
        category: data.category || null,
        location: data.location || null,
        email: data.email || null,
        phone: data.phone || null,
        website: data.website || null,
        notes: data.notes || null,
      }

      const result = await createVendor(vendorData)

      if (result.success) {
        toast.success('Vendor created successfully')
        reset()
        onSuccess?.()
      } else {
        toast.error(result.error || 'Failed to create vendor')
      }
    } catch (error) {
      console.error('Error creating vendor:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Manual Entry</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enter vendor information manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 dark:text-white">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="Vendor name"
            />
            {errors.name && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-900 dark:text-white">
              Category
            </Label>
            <Input
              id="category"
              {...register('category')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Electronics, Textiles, Raw Materials"
            />
            {errors.category && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-900 dark:text-white">
              Location
            </Label>
            <Input
              id="location"
              {...register('location')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., New York, USA"
            />
            {errors.location && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 dark:text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="vendor@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900 dark:text-white">
              Phone
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-gray-900 dark:text-white">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              {...register('website')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-900 dark:text-white">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="Additional notes about this vendor"
              rows={4}
            />
            {errors.notes && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.notes.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00FF7F] text-black hover:brightness-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Vendor'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

