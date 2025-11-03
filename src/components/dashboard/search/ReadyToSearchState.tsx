"use client"

import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ReadyToSearchStateProps {
  entityType: 'supplier' | 'factory' | 'warehouse' | 'forwarder' | 'carrier' | 'supplier-factory' | 'logistics'
}

export function ReadyToSearchState({ entityType }: ReadyToSearchStateProps) {
  const getEntityLabel = () => {
    switch (entityType) {
      case 'supplier': return 'suppliers'
      case 'factory': return 'factories'
      case 'supplier-factory': return 'suppliers and factories'
      case 'warehouse': return 'warehouses'
      case 'forwarder': return 'freight forwarders'
      case 'carrier': return 'carriers'
      case 'logistics': return 'logistics partners'
      default: return 'partners'
    }
  }

  return (
    <Card className="dashboard-card p-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-pulse"></div>
          <div className="relative bg-blue-600 dark:bg-blue-500 rounded-full p-6">
            <Search className="h-12 w-12 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Ready to Search
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Set your filters and click <span className="font-semibold text-gray-900 dark:text-white">Search</span> to find {getEntityLabel()} that match your criteria.
        </p>
      </div>
    </Card>
  )
}

