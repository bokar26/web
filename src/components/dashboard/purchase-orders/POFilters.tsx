"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { purchaseOrders } from "@/lib/mockData"
import { cn } from "@/lib/utils"

interface POFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  supplierFilter: string;
  setSupplierFilter: (supplier: string) => void;
  regionFilter: string;
  setRegionFilter: (region: string) => void;
  slaStatusFilter: string;
  setSlaStatusFilter: (slaStatus: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const POFilters: React.FC<POFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  supplierFilter,
  setSupplierFilter,
  regionFilter,
  setRegionFilter,
  slaStatusFilter,
  setSlaStatusFilter,
  onRefresh,
  isRefreshing
}) => {
  const uniqueSuppliers = Array.from(new Set(purchaseOrders.map(po => po.supplier.name)))
  const uniqueRegions = Array.from(new Set(purchaseOrders.map(po => po.region)))

  return (
    <Card className="dashboard-card p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-white" />
          <Input
            placeholder="Search PO#, Supplier, Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <Filter className="h-4 w-4 mr-2 text-gray-600 dark:text-white" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <SelectValue placeholder="Supplier" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <SelectItem value="all">All Suppliers</SelectItem>
            {uniqueSuppliers.map(supplier => (
              <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <SelectItem value="all">All Regions</SelectItem>
            {uniqueRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={slaStatusFilter} onValueChange={setSlaStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <SelectValue placeholder="SLA Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white">
            <SelectItem value="all">All SLA Statuses</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="breached">Breached</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing ? "animate-spin" : "")} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </Card>
  )
}
