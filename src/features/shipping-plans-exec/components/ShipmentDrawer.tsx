"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { OverviewTab } from "./sections/OverviewTab"
import { RFQBookingTab } from "./sections/RFQBookingTab"
import { DocsTab } from "./sections/DocsTab"
import { CostsTab } from "./sections/CostsTab"
import { TasksTab } from "./sections/TasksTab"
import { ActivityTab } from "./sections/ActivityTab"
import { useShipmentCore } from "../hooks/useShipmentData"
import { FileText, DollarSign, CheckSquare, Activity, Package, Ship } from "lucide-react"

export interface ShipmentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipmentId?: string | null
}

export function ShipmentDrawer({ open, onOpenChange, shipmentId }: ShipmentDrawerProps) {
  const { user } = useUser()
  const { data: shipment, loading } = useShipmentCore(shipmentId)
  const [activeTab, setActiveTab] = useState("overview")

  // Reset tab when drawer closes
  useEffect(() => {
    if (!open) {
      setActiveTab("overview")
    }
  }, [open])

  // Handle ESC key to close
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  if (!shipmentId) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader className="pb-4 flex-shrink-0">
          <SheetTitle className="text-white">
            Shipment {shipmentId.slice(0, 8)}
          </SheetTitle>
          {shipment && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={shipment.status === 'booked' ? 'default' : 'secondary'}>
                {shipment.status}
              </Badge>
              <span className="text-sm text-gray-400">
                {shipment.origin_port_id || 'N/A'} → {shipment.dest_port_id || 'N/A'}
              </span>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-6 mb-4 flex-shrink-0">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="rfq" className="text-xs">
                <Ship className="w-3 h-3 mr-1" />
                RFQ/Booking
              </TabsTrigger>
              <TabsTrigger value="docs" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Docs
              </TabsTrigger>
              <TabsTrigger value="costs" className="text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                Costs
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs">
                <CheckSquare className="w-3 h-3 mr-1" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                Activity
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview" className="mt-0">
                <OverviewTab shipmentId={shipmentId} />
              </TabsContent>
              <TabsContent value="rfq" className="mt-0">
                <RFQBookingTab shipmentId={shipmentId} />
              </TabsContent>
              <TabsContent value="docs" className="mt-0">
                {open && activeTab === 'docs' ? <DocsTab shipmentId={shipmentId} /> : null}
              </TabsContent>
              <TabsContent value="costs" className="mt-0">
                <CostsTab shipmentId={shipmentId} />
              </TabsContent>
              <TabsContent value="tasks" className="mt-0">
                <TasksTab shipmentId={shipmentId} />
              </TabsContent>
              <TabsContent value="activity" className="mt-0">
                {open && activeTab === 'activity' ? <ActivityTab shipmentId={shipmentId} /> : null}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
