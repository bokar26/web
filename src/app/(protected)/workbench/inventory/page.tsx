"use client"

import { useState } from "react"
import { InventoryKpiStrip } from "./_components/InventoryKpiStrip"
import { InventoryTable } from "./_components/InventoryTable"
import { InventoryConsole } from "@/features/inventory-exec/components/InventoryConsole"
import { Section } from "../_components/Section"
import { POModal } from "@/features/inventory-exec/components/POModal"
import { TransferModal } from "@/features/inventory-exec/components/TransferModal"
import { features } from "@/lib/features"

export default function InventoryPage() {
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

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
            {/* Inventory Console */}
            {features.inventoryExec && (
              <div className="pt-2 md:pt-3">
                <Section title="Inventory Console" subtitle="Plans, POs, Transfers, Adjustments, Counts">
                  <InventoryConsole />
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

