"use client"

import { CustomersTable } from "../_components/CustomersTable"

export default function CustomersPage() {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Customers
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage customer relationships and track performance
            </p>
          </div>

          {/* Customers Table */}
          <CustomersTable />
        </div>
      </div>
    </div>
  )
}

