"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { applyQuotes, type MappedQuote } from "../actions/applyQuotes"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { Upload, FileText, Check } from "lucide-react"

interface ApplyQuoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply?: () => void
}

type Step = 'upload' | 'mapping' | 'preview' | 'complete'

export function ApplyQuoteDialog({
  open,
  onOpenChange,
  onApply,
}: ApplyQuoteDialogProps) {
  const { user } = useUser()
  const [step, setStep] = useState<Step>('upload')
  const [isApplying, setIsApplying] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [mappedQuotes, setMappedQuotes] = useState<MappedQuote[]>([])
  const [previewData, setPreviewData] = useState<Array<Record<string, string>>>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
      // Parse CSV (simplified - in production use a proper CSV parser)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',')
        const data = lines.slice(1).map(line => {
          const values = line.split(',')
          const row: Record<string, string> = {}
          headers.forEach((header, idx) => {
            row[header.trim()] = values[idx]?.trim() || ''
          })
          return row
        })
        setPreviewData(data)
        setStep('mapping')
      }
      reader.readAsText(file)
    } else {
      toast.error("Please upload a CSV file")
    }
  }

  const handleMapping = () => {
    // In a real implementation, this would map CSV columns to quote fields
    // For now, create mock mapped quotes from preview data
    const quotes: MappedQuote[] = previewData.slice(0, 3).map((row, idx) => ({
      supplierId: row.supplier || `supplier-${idx}`,
      category: row.category || 'materials',
      items: row.items || 'Item A, Item B',
      currentRate: parseFloat(row.currentRate || '100'),
      newRate: parseFloat(row.newRate || '95'),
    }))
    setMappedQuotes(quotes)
    setStep('preview')
  }

  const handleApply = async () => {
    if (!user?.id) {
      toast.error("Please sign in to apply quotes")
      return
    }

    setIsApplying(true)
    try {
      const result = await applyQuotes({
        mappedQuotes,
        scope: {},
        ownerUserId: user.id,
      })

      if (result.ok) {
        toast.success(`Successfully applied ${result.appliedCount || 0} quotes`)
        onApply?.()
        setStep('complete')
        setTimeout(() => {
          onOpenChange(false)
          setStep('upload')
          setCsvFile(null)
          setMappedQuotes([])
          setPreviewData([])
        }, 1500)
      } else {
        toast.error(result.error || "Failed to apply quotes")
      }
    } catch (error: any) {
      console.error('[ApplyQuoteDialog] Error:', error)
      toast.error(error.message || "Failed to apply quotes")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Apply Supplier Quotes</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload CSV file with supplier quotes and apply them to cost projections.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <Label htmlFor="csv-upload" className="cursor-pointer">
                <span className="text-white font-medium">Click to upload CSV file</span>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
              <p className="text-sm text-gray-400 mt-2">CSV files only</p>
            </div>
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-700 dark:text-white">Column Mapping</Label>
              <p className="text-sm text-gray-400 mt-1">
                Map CSV columns to quote fields (auto-detected for standard formats)
              </p>
            </div>
            <div className="border border-gray-600 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Preview (first 3 rows):</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      {previewData[0] && Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="text-left py-2 px-2 text-gray-300">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 3).map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-700">
                        {Object.values(row).map((value, vIdx) => (
                          <td key={vIdx} className="py-2 px-2 text-gray-400">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Button onClick={handleMapping} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Continue to Preview
            </Button>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-700 dark:text-white">Preview Deltas</Label>
              <p className="text-sm text-gray-400 mt-1">
                Review changes before applying
              </p>
            </div>
            <div className="border border-gray-600 rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600 bg-gray-900">
                    <th className="text-left py-2 px-4 text-gray-300">Supplier</th>
                    <th className="text-left py-2 px-4 text-gray-300">Category</th>
                    <th className="text-right py-2 px-4 text-gray-300">Current Rate</th>
                    <th className="text-right py-2 px-4 text-gray-300">New Rate</th>
                    <th className="text-right py-2 px-4 text-gray-300">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedQuotes.map((quote, idx) => (
                    <tr key={idx} className="border-b border-gray-700">
                      <td className="py-2 px-4 text-gray-400">{quote.supplierId}</td>
                      <td className="py-2 px-4 text-gray-400">{quote.category}</td>
                      <td className="py-2 px-4 text-gray-400 text-right">${quote.currentRate.toFixed(2)}</td>
                      <td className="py-2 px-4 text-gray-400 text-right">${quote.newRate.toFixed(2)}</td>
                      <td className={`py-2 px-4 text-right ${
                        quote.newRate < quote.currentRate ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {quote.newRate < quote.currentRate ? '-' : '+'}
                        ${Math.abs(quote.newRate - quote.currentRate).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('mapping')}
                disabled={isApplying}
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isApplying ? 'Applying...' : 'Apply Quotes'}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4 py-4 text-center">
            <Check className="w-16 h-16 mx-auto text-emerald-400" />
            <p className="text-white font-medium">Quotes applied successfully!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

