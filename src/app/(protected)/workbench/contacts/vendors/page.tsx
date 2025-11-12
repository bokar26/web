"use client"

import { VendorsTable } from "../_components/VendorsTable"

export default function VendorsPage() {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Vendors
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your saved vendors from suppliers, warehouses, and logistics partners
            </p>
          </div>

          {/* Vendors Table */}
          <VendorsTable />
        </div>
      </div>
    </div>
  )
}

