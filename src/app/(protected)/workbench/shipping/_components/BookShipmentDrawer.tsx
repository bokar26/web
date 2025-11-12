"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Ship, Calendar, MapPin } from "lucide-react"

interface BookShipmentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipmentId?: string
}

export function BookShipmentDrawer({
  open,
  onOpenChange,
  shipmentId,
}: BookShipmentDrawerProps) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    carrier: "",
    incoterm: "FOB",
    etd: "",
    eta: "",
  })

  const handleSubmit = async () => {
    // TODO: Implement booking logic using shipping-plans-exec actions
    console.log("Booking shipment:", formData)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Book Shipment
          </SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-gray-400">
            Create or update shipment details, choose carrier, and set dates
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Origin</Label>
              <Input
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="Origin port"
              />
            </div>
            <div>
              <Label className="text-gray-900 dark:text-white">Destination</Label>
              <Input
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Destination port"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Carrier / Freight Forwarder</Label>
            <Select value={formData.carrier} onValueChange={(value) => setFormData({ ...formData, carrier: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maersk">Maersk</SelectItem>
                <SelectItem value="cma-cgm">CMA CGM</SelectItem>
                <SelectItem value="msc">MSC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">INCOTERM</Label>
            <Select value={formData.incoterm} onValueChange={(value) => setFormData({ ...formData, incoterm: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOB">FOB</SelectItem>
                <SelectItem value="CIF">CIF</SelectItem>
                <SelectItem value="EXW">EXW</SelectItem>
                <SelectItem value="DDP">DDP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                ETD
              </Label>
              <Input
                type="date"
                value={formData.etd}
                onChange={(e) => setFormData({ ...formData, etd: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                ETA
              </Label>
              <Input
                type="date"
                value={formData.eta}
                onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSubmit}>
              Book Shipment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

