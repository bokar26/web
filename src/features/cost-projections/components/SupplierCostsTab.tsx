"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApplyQuoteDialog } from "./ApplyQuoteDialog"
import { useState } from "react"
import { FileText } from "lucide-react"

interface SupplierCost {
  supplier: string
  category: string
  items: string
  currentRate: number
  quoteStatus: 'pending' | 'applied' | 'expired' | 'none'
}

interface SupplierCostsTabProps {
  supplierCosts: SupplierCost[]
  onApplyQuote: () => void
}

// Mock data - in production, fetch from server
const defaultSupplierCosts: SupplierCost[] = [
  { supplier: 'Supplier A', category: 'Raw Materials', items: 'Item A, Item B', currentRate: 120000, quoteStatus: 'pending' },
  { supplier: 'Supplier B', category: 'Labor', items: 'Item C', currentRate: 95000, quoteStatus: 'applied' },
  { supplier: 'Supplier C', category: 'Transportation', items: 'Item D, Item E', currentRate: 85000, quoteStatus: 'expired' },
  { supplier: 'Supplier D', category: 'Raw Materials', items: 'Item F', currentRate: 75000, quoteStatus: 'none' },
  { supplier: 'Supplier E', category: 'Packaging', items: 'Item G', currentRate: 65000, quoteStatus: 'none' },
]

export function SupplierCostsTab({ supplierCosts = defaultSupplierCosts, onApplyQuote }: SupplierCostsTabProps) {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)

  const getQuoteStatusBadge = (status: SupplierCost['quoteStatus']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-white',
      applied: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-white',
      none: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white',
    }
    const labels = {
      pending: 'Pending',
      applied: 'Applied',
      expired: 'Expired',
      none: 'None',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={() => setIsApplyDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Apply Quote
        </Button>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Supplier Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {supplierCosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-white">No supplier costs to display</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Supplier</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Items</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Current Rate</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Quote Status</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierCosts.map((supplier, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{supplier.supplier}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-white">{supplier.category}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-white">{supplier.items}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-white text-right">
                        ${supplier.currentRate.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getQuoteStatusBadge(supplier.quoteStatus)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsApplyDialogOpen(true)}
                          className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
                        >
                          Apply Quote
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ApplyQuoteDialog
        open={isApplyDialogOpen}
        onOpenChange={setIsApplyDialogOpen}
        onApply={onApplyQuote}
      />
    </div>
  )
}

