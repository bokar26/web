"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadDocument } from "@/server/actions/workbench/docs.upload"
import { linkDocument } from "@/server/actions/workbench/docs.link"
import { FileText, Upload } from "lucide-react"

export function DocsTab() {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName || !fileType) {
      toast.error("Please provide file name and type");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadDocument({
        fileName,
        fileType,
        fileSize: 0, // Would be from actual file in production
      });

      if (result.ok) {
        toast.success("Document uploaded successfully");
        setFileName("");
        setFileType("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[DocsTab] Upload error:', error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="fileName" className="text-gray-900 dark:text-white">File Name</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="fileType" className="text-gray-900 dark:text-white">File Type</Label>
              <Input
                id="fileType"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                placeholder="pdf, xlsx, etc."
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isUploading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

