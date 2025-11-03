"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Download
} from "lucide-react"
import { purchaseOrders, PurchaseOrder } from "@/lib/mockData"
import { POKPICards, POMiniKPICards } from "@/components/dashboard/purchase-orders/POKPICards"
import { POFilters } from "@/components/dashboard/purchase-orders/POFilters"
import { POTable } from "@/components/dashboard/purchase-orders/POTable"
import { PODetailDrawer } from "@/components/dashboard/purchase-orders/PODetailDrawer"
import { POAlertBanner } from "@/components/dashboard/purchase-orders/POAlertBanner"

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [slaStatusFilter, setSlaStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [sortBy, setSortBy] = useState("orderDate")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = purchaseOrders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (order.lineItems?.some(item =>
                             item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchTerm.toLowerCase())
                           ) ?? false)
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesSupplier = supplierFilter === "all" || order.supplier.name === supplierFilter
      const matchesRegion = regionFilter === "all" || order.region === regionFilter
      const matchesSLA = slaStatusFilter === "all" || order.slaStatus === slaStatusFilter

      return matchesSearch && matchesStatus && matchesSupplier && matchesRegion && matchesSLA
    })

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'id':
          aValue = a.id
          bValue = b.id
          break
        case 'supplier':
          aValue = a.supplier.name
          bValue = b.supplier.name
          break
        case 'orderDate':
          aValue = new Date(a.orderDate).getTime()
          bValue = new Date(b.orderDate).getTime()
          break
        case 'eta':
          aValue = new Date(a.eta).getTime()
          bValue = new Date(b.eta).getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        default:
          aValue = a.orderDate
          bValue = b.orderDate
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [searchTerm, statusFilter, supplierFilter, regionFilter, slaStatusFilter, sortBy, sortDirection])

  const handleOrderClick = (order: PurchaseOrder) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedOrder(null)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ['PO #', 'Supplier', 'Order Date', 'ETA', 'Status', 'SLA Status', 'Amount', 'Progress %']
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.supplier.name,
        order.orderDate,
        order.eta,
        order.status,
        order.slaStatus,
        order.amount,
        order.progress
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `purchase-orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFilterAtRisk = () => {
    setSlaStatusFilter('at-risk')
  }

  const handleFilterBreached = () => {
    setSlaStatusFilter('breached')
  }

  const handleFilterPending = () => {
    setStatusFilter('confirmed')
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-200 dark:border-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      <POAlertBanner
        orders={filteredOrders}
        onFilterAtRisk={handleFilterAtRisk}
        onFilterBreached={handleFilterBreached}
        onFilterPending={handleFilterPending}
      />

      {/* KPI Cards */}
      <POKPICards />
      <POMiniKPICards />

      {/* Filters */}
      <POFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        supplierFilter={supplierFilter}
        setSupplierFilter={setSupplierFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        slaStatusFilter={slaStatusFilter}
        setSlaStatusFilter={setSlaStatusFilter}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Table */}
      <POTable
        orders={filteredOrders}
        onOrderClick={handleOrderClick}
        onExport={handleExport}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Detail Drawer */}
      <PODetailDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}