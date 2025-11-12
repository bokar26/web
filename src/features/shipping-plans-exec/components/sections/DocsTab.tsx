"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download } from "lucide-react"
import { useShipmentDocs } from "../../hooks/useShipmentData"
import { generateDocument } from "../../actions/generateDocument"
import { DOC_TYPES, DOCUMENT_TYPES, TOAST_MESSAGES } from "../../constants"
import type { DocumentType } from "../../types"

interface DocsTabProps {
  shipmentId?: string
}

export function DocsTab({ shipmentId }: DocsTabProps) {
  const { user } = useUser()
  const { data: documents, loading, error } = useShipmentDocs(shipmentId)
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(DOCUMENT_TYPES.ASN)
  const [isGenerating, setIsGenerating] = useState<Record<DocumentType, boolean>>({
    [DOCUMENT_TYPES.ASN]: false,
    [DOCUMENT_TYPES.CI]: false,
    [DOCUMENT_TYPES.PL]: false,
  })

  const handleGenerateDocument = async (type: DocumentType) => {
    if (!shipmentId || !user?.id) {
      toast.error("Please sign in to generate documents")
      return
    }

    setIsGenerating((prev) => ({ ...prev, [type]: true }))
    try {
      const result = await generateDocument({
        shipmentId,
        type,
        ownerUserId: user.id,
      })

      toast.success(TOAST_MESSAGES.DOCUMENT_GENERATED(type))
      // Refresh documents list
      // The hook will automatically refetch, but we can force a refresh by updating shipmentId dependency
      // For now, the hook should auto-refresh
    } catch (error) {
      console.error('[DocsTab] Failed to generate document:', error)
      toast.error(error instanceof Error ? error.message : TOAST_MESSAGES.DOCUMENT_ERROR)
    } finally {
      setIsGenerating((prev) => ({ ...prev, [type]: false }))
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Loading documents...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        Error: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Generate Controls */}
      <div className="flex gap-2 items-center">
        <div className="flex gap-1 bg-gray-800 rounded-md p-1">
          {DOC_TYPES.map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selectedDocType === type ? "default" : "ghost"}
              onClick={() => setSelectedDocType(type)}
              className="text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => handleGenerateDocument(selectedDocType)}
          disabled={isGenerating[selectedDocType] || !shipmentId}
        >
          {isGenerating[selectedDocType] ? "Generating..." : "Generate"}
        </Button>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center text-gray-400">
            No documents yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2 text-gray-400">Type</th>
                <th className="text-left p-2 text-gray-400">Version</th>
                <th className="text-left p-2 text-gray-400">Created At</th>
                <th className="text-left p-2 text-gray-400">Link</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-800">
                  <td className="p-2 text-white">{doc.document_type}</td>
                  <td className="p-2 text-gray-400">v{doc.version}</td>
                  <td className="p-2 text-gray-400">
                    {doc.generated_at ? new Date(doc.generated_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-2">
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-500">No URL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

