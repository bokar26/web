"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, ArrowRightLeft, SlidersHorizontal, ClipboardList } from "lucide-react"
import { InventoryKpiStrip } from "./_components/InventoryKpiStrip"
import { InventoryTable } from "./_components/InventoryTable"
import { Section } from "../_components/Section"
import { POModal } from "@/features/inventory-exec/components/POModal"
import { TransferModal } from "@/features/inventory-exec/components/TransferModal"
import { Button } from "@/components/ui/button"
import { features } from "@/lib/features"

export default function InventoryPage() {
  const router = useRouter()
  const [poModalOpen, setPoModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [selectedSku, setSelectedSku] = useState<string>()
  const [selectedLocation, setSelectedLocation] = useState<string>()

  const handleCreatePO = (skuId: string, location: string) => {
    setSelectedSku(skuId)
    setSelectedLocation(location)
    setPoModalOpen(true)
  }

  const handleTransfer = (skuId: string, location: string) => {
    setSelectedSku(skuId)
    setSelectedLocation(location)
    setTransferModalOpen(true)
  }

  const handleConsoleAction = (action: string) => {
    // For now, these could route to subpages or open modals
    // Based on the InventoryConsole component, these actions map to tabs
    // We'll route to purchase-orders page for POs, and could add other routes later
    switch (action) {
      case 'pos':
        router.push('/workbench/inventory/purchase-orders')
        break
      case 'plans':
      case 'transfers':
      case 'adjustments':
      case 'counts':
        // These could open modals or route to dedicated pages
        // For now, we'll just show a toast or route to purchase-orders as placeholder
        router.push('/workbench/inventory/purchase-orders')
        break
      default:
        break
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
            {/* Inventory Console */}
            {features.inventoryExec && (
              <div className="pt-2 md:pt-3">
                <Section title="Inventory Console" subtitle="Plans, POs, Transfers, Adjustments, Counts">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border rounded-xl px-3.5 py-3 text-sm font-medium hover:ring-1 hover:ring-emerald-400/50 hover:bg-foreground/5 transition"
                      onClick={() => handleConsoleAction('plans')}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Plans
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border rounded-xl px-3.5 py-3 text-sm font-medium hover:ring-1 hover:ring-emerald-400/50 hover:bg-foreground/5 transition"
                      onClick={() => handleConsoleAction('pos')}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      POs
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border rounded-xl px-3.5 py-3 text-sm font-medium hover:ring-1 hover:ring-emerald-400/50 hover:bg-foreground/5 transition"
                      onClick={() => handleConsoleAction('transfers')}
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Transfers
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border rounded-xl px-3.5 py-3 text-sm font-medium hover:ring-1 hover:ring-emerald-400/50 hover:bg-foreground/5 transition"
                      onClick={() => handleConsoleAction('adjustments')}
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Adjustments
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border rounded-xl px-3.5 py-3 text-sm font-medium hover:ring-1 hover:ring-emerald-400/50 hover:bg-foreground/5 transition"
                      onClick={() => handleConsoleAction('counts')}
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Counts
                    </Button>
                  </div>
                </Section>
              </div>
            )}

            {/* KPI Strip */}
            <InventoryKpiStrip />

            {/* Inventory Table */}
            <Section id="inventory-table" title="Inventory by SKU & Location" defaultExpanded={true}>
              <InventoryTable
                onCreatePO={handleCreatePO}
                onTransfer={handleTransfer}
              />
            </Section>
          </div>
        </div>
      </div>

      {/* PO Modal */}
      <POModal
        isOpen={poModalOpen}
        onClose={() => {
          setPoModalOpen(false)
          setSelectedSku(undefined)
          setSelectedLocation(undefined)
        }}
        initialLines={
          selectedSku && selectedLocation
            ? [
                {
                  sku_id: selectedSku,
                  qty: 0,
                  price: 0,
                  warehouse_id: selectedLocation,
                  promised_date: "",
                },
              ]
            : undefined
        }
      />

      {/* Transfer Modal */}
      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false)
          setSelectedSku(undefined)
          setSelectedLocation(undefined)
        }}
        initialLines={
          selectedSku
            ? [
                {
                  sku_id: selectedSku,
                  qty: 0,
                },
              ]
            : undefined
        }
        toWarehouseId={selectedLocation}
      />
    </div>
  )
}

