"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"

interface CostProjectionException {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high'
  message: string
  detectedAt: string
}

interface ExceptionsBannerProps {
  exceptions: CostProjectionException[]
  onViewExceptions: () => void
}

export function ExceptionsBanner({ exceptions, onViewExceptions }: ExceptionsBannerProps) {
  if (exceptions.length === 0) {
    return null
  }

  const highSeverityCount = exceptions.filter(ex => ex.severity === 'high').length
  const mediumSeverityCount = exceptions.filter(ex => ex.severity === 'medium').length

  return (
    <Alert 
      variant={highSeverityCount > 0 ? "destructive" : "default"}
      className="mb-4 border-yellow-500/30 bg-yellow-900/20"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-white">
        {exceptions.length} Exception{exceptions.length !== 1 ? 's' : ''} Detected
      </AlertTitle>
      <AlertDescription className="text-gray-300">
        {highSeverityCount > 0 && `${highSeverityCount} high severity`}
        {highSeverityCount > 0 && mediumSeverityCount > 0 && ', '}
        {mediumSeverityCount > 0 && `${mediumSeverityCount} medium severity`}
        {exceptions.length > highSeverityCount + mediumSeverityCount && 
          `, ${exceptions.length - highSeverityCount - mediumSeverityCount} low severity`}
        {' '}issue{exceptions.length !== 1 ? 's' : ''} require attention.
      </AlertDescription>
      <Button
        variant="outline"
        size="sm"
        onClick={onViewExceptions}
        className="mt-3 text-white border-gray-600 hover:bg-gray-800"
      >
        <ExternalLink className="w-3 h-3 mr-2" />
        View in Approvals & Exceptions
      </Button>
    </Alert>
  )
}

