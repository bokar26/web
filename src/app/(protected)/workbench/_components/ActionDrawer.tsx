"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type DrawerMode = "runForecast" | "createPO" | "bookShipment" | "uploadDocs" | "resolveException" | "transferStock"

interface ActionDrawerProps {
  open: boolean
  mode: DrawerMode
  payload?: unknown
  onClose: () => void
  onSubmit: (payload: unknown) => void | Promise<void>
  isSubmitting?: boolean
}

// Placeholder form components (to be implemented)
function CreatePoForm({ payload, onSubmit, isSubmitting }: { payload?: unknown; onSubmit: (p: unknown) => void; isSubmitting?: boolean }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Create PO form - {JSON.stringify(payload)}
      </p>
      <Button onClick={() => onSubmit(payload)} disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create PO"}
      </Button>
    </div>
  )
}

function BookShipmentForm({ payload, onSubmit, isSubmitting }: { payload?: unknown; onSubmit: (p: unknown) => void; isSubmitting?: boolean }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Book Shipment form - {JSON.stringify(payload)}
      </p>
      <Button onClick={() => onSubmit(payload)} disabled={isSubmitting}>
        {isSubmitting ? "Booking..." : "Book Shipment"}
      </Button>
    </div>
  )
}

function ResolveExceptionForm({ payload, onSubmit, isSubmitting }: { payload?: unknown; onSubmit: (p: unknown) => void; isSubmitting?: boolean }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Resolve Exception form - {JSON.stringify(payload)}
      </p>
      <Button onClick={() => onSubmit(payload)} disabled={isSubmitting}>
        {isSubmitting ? "Resolving..." : "Resolve"}
      </Button>
    </div>
  )
}

export function ActionDrawer({
  open,
  mode,
  payload,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ActionDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for open query param
    const openParam = searchParams.get("open")
    if (openParam && !open) {
      const [drawerMode, id] = openParam.split(":")
      if (drawerMode && id) {
        // Handle opening drawer based on query param
        // This will be handled by the parent component
      }
    }
  }, [searchParams, open])

  const handleClose = () => {
    onClose()
    // Remove open query param
    const params = new URLSearchParams(searchParams.toString())
    params.delete("open")
    router.push(`/workbench${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    })
  }

  const getTitle = () => {
    switch (mode) {
      case "createPO":
        return "Create Purchase Order"
      case "bookShipment":
        return "Book Shipment"
      case "resolveException":
        return "Resolve Exception"
      case "runForecast":
        return "Run Forecast"
      case "uploadDocs":
        return "Upload Document"
      case "transferStock":
        return "Transfer Stock"
      default:
        return "Action"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "createPO":
        return "Create a new purchase order from the suggestion"
      case "bookShipment":
        return "Book or confirm shipment details"
      case "resolveException":
        return "Resolve, snooze, or assign exception"
      case "runForecast":
        return "Run demand forecast for the current period"
      case "uploadDocs":
        return "Upload and manage documents"
      case "transferStock":
        return "Transfer stock between locations"
      default:
        return ""
    }
  }

  const renderForm = () => {
    switch (mode) {
      case "createPO":
        return <CreatePoForm payload={payload} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      case "bookShipment":
        return <BookShipmentForm payload={payload} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      case "resolveException":
        return <ResolveExceptionForm payload={payload} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      default:
        return (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Form for {mode} - {JSON.stringify(payload)}
          </p>
        )
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-white">
            {getTitle()}
          </SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-gray-400">
            {getDescription()}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {renderForm()}
        </div>
      </SheetContent>
    </Sheet>
  )
}
