"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { createVendor } from "../actions"
import { toast } from "sonner"

interface ManualEntryTableProps {
  onSuccess?: () => void
}

interface TableRow {
  id: string
  fieldName: string | null
  isCustom: boolean
  customFieldName: string
  value: string
}

// Standard vendor fields available in the dropdown
const STANDARD_FIELDS = [
  { value: "name", label: "name" },
  { value: "category", label: "category" },
  { value: "location", label: "location" },
  { value: "status", label: "status" },
  { value: "source", label: "source" },
  { value: "source_id", label: "source_id" },
  { value: "country", label: "country" },
  { value: "owner_user_id", label: "owner_user_id" },
  { value: "is_admin_created", label: "is_admin_created" },
  { value: "email", label: "email" },
  { value: "phone", label: "phone" },
  { value: "website", label: "website" },
  { value: "notes", label: "notes" },
]

const CUSTOM_FIELD_OPTION = "__custom__"

export function ManualEntryTable({ onSuccess }: ManualEntryTableProps) {
  // Generate unique ID for new rows
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const [rows, setRows] = useState<TableRow[]>([
    { id: generateId(), fieldName: null, isCustom: false, customFieldName: "", value: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addRow = () => {
    setRows([...rows, { id: generateId(), fieldName: null, isCustom: false, customFieldName: "", value: "" }])
  }

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id))
    } else {
      toast.error("At least one row is required")
    }
  }

  const updateRow = (id: string, updates: Partial<TableRow>) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          const updated = { ...row, ...updates }
          // When switching to custom field, clear fieldName
          if (updates.isCustom === true) {
            updated.fieldName = null
          }
          // When switching from custom field, clear customFieldName
          if (updates.isCustom === false && updates.fieldName !== undefined) {
            updated.customFieldName = ""
          }
          return updated
        }
        return row
      })
    )
  }

  const handleFieldNameChange = (id: string, value: string) => {
    if (value === CUSTOM_FIELD_OPTION) {
      updateRow(id, { isCustom: true, fieldName: null })
    } else {
      updateRow(id, { fieldName: value, isCustom: false, customFieldName: "" })
    }
  }

  const handleSubmit = async () => {
    // Validate: at least one row must have fieldName="name" with non-empty value
    const nameRow = rows.find((row) => {
      if (row.isCustom) return false
      return row.fieldName === "name" && row.value.trim().length > 0
    })

    if (!nameRow) {
      toast.error("At least one row must have 'name' field with a value")
      return
    }

    setIsSubmitting(true)

    try {
      // Separate standard fields from custom fields
      const standardFields: Record<string, any> = {}
      const customFields: Record<string, any> = {}

      rows.forEach((row) => {
        if (!row.fieldName && !row.isCustom) return // Skip empty rows
        if (row.value.trim().length === 0) return // Skip rows with empty values

        if (row.isCustom && row.customFieldName.trim()) {
          // Custom field: store in payload
          customFields[row.customFieldName.trim()] = row.value.trim()
        } else if (row.fieldName) {
          // Standard field: store in main object
          standardFields[row.fieldName] = row.value.trim()
        }
      })

      // Build vendor data object
      const vendorData = {
        name: standardFields.name || "",
        category: standardFields.category || undefined,
        location: standardFields.location || undefined,
        email: standardFields.email || undefined,
        phone: standardFields.phone || undefined,
        website: standardFields.website || undefined,
        notes: standardFields.notes || undefined,
        payload: Object.keys(customFields).length > 0 ? customFields : undefined,
      }

      const result = await createVendor(vendorData)

      if (result.success) {
        toast.success("Vendor created successfully")
        // Reset form to single empty row
        setRows([{ id: generateId(), fieldName: null, isCustom: false, customFieldName: "", value: "" }])
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to create vendor")
      }
    } catch (error) {
      console.error("Error creating vendor:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Manual Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-[200px] text-gray-900 dark:text-white">Field Name</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Value</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="bg-white dark:bg-gray-900">
                  <TableCell className="p-2">
                    {row.isCustom ? (
                      <Input
                        placeholder="Custom field name..."
                        value={row.customFieldName}
                        onChange={(e) =>
                          updateRow(row.id, { customFieldName: e.target.value })
                        }
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white h-9"
                      />
                    ) : (
                      <Select
                        value={row.fieldName || ""}
                        onValueChange={(value) => handleFieldNameChange(row.id, value)}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white h-9">
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent>
                          {STANDARD_FIELDS.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                          <SelectItem value={CUSTOM_FIELD_OPTION}>Custom Field…</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      value={row.value}
                      onChange={(e) => updateRow(row.id, { value: e.target.value })}
                      placeholder="Enter value..."
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(row.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={rows.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#00FF7F] text-black hover:brightness-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Vendor...
              </>
            ) : (
              "Add Vendor"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

