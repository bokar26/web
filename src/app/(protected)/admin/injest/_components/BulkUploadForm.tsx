"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { parseCSV, parseXLSX } from "../_utils/parseFile"
import { bulkCreateVendors } from "../actions"
import type { BulkVendorRow, BulkUploadResult } from "@/types/vendors"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BulkUploadFormProps {
  onSuccess?: () => void
}

export function BulkUploadForm({ onSuccess }: BulkUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls']
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))

    if (!validExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Please upload a CSV or Excel file (.csv, .xlsx, .xls)')
      return
    }

    setFile(selectedFile)
    setUploadResult(null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setIsProcessing(true)
    setUploadResult(null)

    try {
      // Parse file based on extension
      let vendors: BulkVendorRow[]
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

      if (fileExtension === '.csv') {
        vendors = await parseCSV(file)
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        vendors = await parseXLSX(file)
      } else {
        toast.error('Unsupported file type')
        setIsProcessing(false)
        return
      }

      if (vendors.length === 0) {
        toast.error('No valid vendors found in file')
        setIsProcessing(false)
        return
      }

      // Upload to server
      const result = await bulkCreateVendors(vendors)

      setUploadResult(result)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          `Upload complete: ${result.inserted} inserted, ${result.skipped} skipped, ${result.errors.length} errors`
        )
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error processing file:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Bulk Upload</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Upload a CSV or Excel file to import multiple vendors at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging
              ? 'border-[#00FF7F] bg-[#00FF7F]/10'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }
          `}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <File className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                disabled={isProcessing}
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop a file here, or click to browse
              </p>
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  asChild
                >
                  <span>Select File</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isProcessing}
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: CSV, XLSX, XLS
              </p>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p className="font-medium">File Format Requirements:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>First row should contain column headers</li>
            <li>Required column: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">name</code></li>
            <li>Optional columns: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">category</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">location</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">email</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">phone</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">website</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">notes</code></li>
            <li>Column names are case-insensitive</li>
          </ul>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || isProcessing}
          className="w-full bg-[#00FF7F] text-black hover:brightness-95"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Vendors
            </>
          )}
        </Button>

        {/* Upload Results */}
        {uploadResult && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Summary</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rows</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uploadResult.total}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-400">Inserted</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {uploadResult.inserted}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Skipped</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {uploadResult.skipped}
                </p>
              </div>
            </div>

            {/* Errors Table */}
            {uploadResult.errors.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                    Errors ({uploadResult.errors.length})
                  </h4>
                </div>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="text-gray-900 dark:text-white">Row</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadResult.errors.slice(0, 10).map((error, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-gray-900 dark:text-white">
                            {error.rowNumber}
                          </TableCell>
                          <TableCell className="text-red-600 dark:text-red-400">
                            {error.message}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {uploadResult.errors.length > 10 && (
                    <div className="p-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                      ... and {uploadResult.errors.length - 10} more errors
                    </div>
                  )}
                </div>
              </div>
            )}

            {uploadResult.inserted > 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm">
                  Successfully imported {uploadResult.inserted} vendor{uploadResult.inserted !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

