"use client"

import { CustomersTable } from "../_components/CustomersTable"

export default function CustomersPage() {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
            <div className="pt-2 md:pt-3">
              {/* Customers Table */}
              <CustomersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

