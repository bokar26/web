"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createShippingBooking } from "@/server/actions/workbench/shipping.create-booking"
import { Ship } from "lucide-react"

export function ShippingTab() {
  const [originPort, setOriginPort] = useState("")
  const [destinationPort, setDestinationPort] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originPort || !destinationPort) {
      toast.error("Please provide origin and destination ports");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createShippingBooking({
        legs: [
          {
            origin: originPort,
            destination: destinationPort,
          },
        ],
      });

      if (result.ok) {
        toast.success(`Shipment created with ${result.data.legCount} legs`);
        setOriginPort("");
        setDestinationPort("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[ShippingTab] Submit error:', error);
      toast.error("Failed to create shipment");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Create Shipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="originPort" className="text-gray-900 dark:text-white">Origin Port</Label>
              <Input
                id="originPort"
                value={originPort}
                onChange={(e) => setOriginPort(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="destinationPort" className="text-gray-900 dark:text-white">Destination Port</Label>
              <Input
                id="destinationPort"
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Shipment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

