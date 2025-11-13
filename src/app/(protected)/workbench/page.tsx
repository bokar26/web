"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { KpiStrip, type KpiItem } from "./_components/KpiStrip"
import { RunForecastCard, CreatePoCard, BookShipmentCard } from "./_components/QuickActionCard"
import { PoSuggestionsTable, type PoSuggestion } from "./_components/PoSuggestionsTable"
import { ExceptionsTable, type Exception } from "./_components/ExceptionsTable"
import { ShipmentsTable, type Shipment } from "./_components/ShipmentsTable"
import { OrdersTable, type Order } from "./_components/OrdersTable"
import { InventoryWatchlist, type InventoryWatchlistItem } from "./_components/InventoryWatchlist"
import { ImportsActivity, type ImportActivity } from "./_components/ImportsActivity"
import { ExportsActivity, type ExportActivity } from "./_components/ExportsActivity"
import { ActivityFeed, type ActivityFeedItem } from "./_components/ActivityFeed"
import { Section } from "./_components/Section"
import { ActionDrawer } from "./_components/ActionDrawer"
import { TrendingUp, AlertTriangle, Truck, Package, Clock } from "lucide-react"

// Mock data - replace with actual Supabase queries
const mockKpiItems: KpiItem[] = [
  {
    key: "forecast-accuracy",
    label: "Forecast Accuracy",
    value: "94.2%",
    delta: 2.1,
    icon: TrendingUp,
    iconColor: "text-blue-400",
    bgColor: "bg-gradient-to-br from-blue-900/50 to-blue-800/30",
    textColor: "text-blue-200",
  },
  {
    key: "stockouts",
    label: "Stockouts (Open)",
    value: 3,
    delta: -1,
    icon: AlertTriangle,
    iconColor: "text-red-400",
    bgColor: "bg-gradient-to-br from-red-900/50 to-red-800/30",
    textColor: "text-red-200",
  },
  {
    key: "on-time-delivery",
    label: "On-Time Delivery",
    value: "87.5%",
    delta: 1.2,
    icon: Truck,
    iconColor: "text-emerald-400",
    bgColor: "bg-gradient-to-br from-emerald-900/50 to-emerald-800/30",
    textColor: "text-emerald-200",
  },
  {
    key: "open-pos",
    label: "Open POs",
    value: "18 ($245k)",
    delta: 0,
    icon: Package,
    iconColor: "text-purple-400",
    bgColor: "bg-gradient-to-br from-purple-900/50 to-purple-800/30",
    textColor: "text-purple-200",
  },
  {
    key: "in-transit",
    label: "In-Transit",
    value: "7 (4.2d avg)",
    delta: 0.5,
    icon: Clock,
    iconColor: "text-cyan-400",
    bgColor: "bg-gradient-to-br from-cyan-900/50 to-cyan-800/30",
    textColor: "text-cyan-200",
  },
]

const mockPoSuggestions: PoSuggestion[] = [
  {
    sku: "SKU-001",
    location: "Warehouse A",
    suggestedQty: 500,
    vendorId: "vendor-1",
    vendorName: "Supplier X",
    targetDate: "2024-01-25",
    unitCost: 12.50,
    reason: "Below reorder point",
  },
  {
    sku: "SKU-002",
    location: "Warehouse B",
    suggestedQty: 300,
    vendorId: "vendor-2",
    vendorName: "Supplier Y",
    targetDate: "2024-01-28",
    unitCost: 8.75,
    reason: "Forecasted demand",
  },
  {
    sku: "SKU-003",
    location: "Warehouse A",
    suggestedQty: 750,
    vendorId: "vendor-1",
    vendorName: "Supplier X",
    targetDate: "2024-01-30",
    unitCost: 15.00,
    reason: "Seasonal increase",
  },
]

const mockExceptions: Exception[] = [
  {
    id: "EXC-001",
    type: "Stockout Risk",
    severity: "high",
    entityType: "SKU",
    entityId: "SKU-001",
    message: "Inventory below reorder point",
    createdAt: "2024-01-15T10:30:00Z",
    status: "open",
  },
  {
    id: "EXC-002",
    type: "Late Shipment",
    severity: "med",
    entityType: "Shipment",
    entityId: "SHIP-002",
    message: "Shipment delayed by 3 days",
    createdAt: "2024-01-14T14:15:00Z",
    status: "open",
  },
]

const mockShipments: Shipment[] = [
  {
    id: "SHIP-001",
    orderRef: "ORD-001",
    lane: "Shanghai → Los Angeles",
    status: "planned",
    etd: "2024-01-20",
    eta: "2024-02-15",
    carrier: "Maersk",
    valueUsd: 12500,
  },
  {
    id: "SHIP-002",
    orderRef: "ORD-002",
    lane: "Hong Kong → New York",
    status: "in_transit",
    etd: "2024-01-18",
    eta: "2024-02-12",
    carrier: "CMA CGM",
    valueUsd: 8900,
  },
]

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Acme Corp",
    date: "2024-01-15",
    status: "confirmed",
    totalUsd: 12500,
  },
  {
    id: "ORD-002",
    customer: "Tech Solutions",
    date: "2024-01-16",
    status: "pending",
    totalUsd: 8900,
  },
]

const mockInventoryWatchlist: InventoryWatchlistItem[] = [
  {
    sku: "SKU-001",
    location: "Warehouse A",
    oh: 45,
    oo: 120,
    bo: 0,
    daysCover: 5,
  },
  {
    sku: "SKU-004",
    location: "Warehouse B",
    oh: 12,
    oo: 50,
    bo: 8,
    daysCover: 3,
  },
]

const mockImports: ImportActivity[] = [
  {
    id: "imp-1",
    filename: "inventory_import_2024.csv",
    status: "success",
    rows: 1250,
    finishedAt: "2h ago",
  },
  {
    id: "imp-2",
    filename: "orders_jan.csv",
    status: "running",
    rows: 500,
  },
]

const mockExports: ExportActivity[] = [
  {
    id: "exp-1",
    type: "Inventory Report",
    status: "success",
    finishedAt: "1d ago",
  },
  {
    id: "exp-2",
    type: "PO Summary",
    status: "queued",
  },
]

const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: "act-1",
    ts: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actor: "John Doe",
    action: "Created PO",
    entityType: "PO",
    entityId: "PO-123",
    details: "Purchase order for SKU-001",
  },
  {
    id: "act-2",
    ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actor: "Jane Smith",
    action: "Booked Shipment",
    entityType: "Shipment",
    entityId: "SHIP-001",
    details: "Shipment from Shanghai to LA",
  },
]

function WorkbenchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"runForecast" | "createPO" | "bookShipment" | "uploadDocs" | "resolveException" | "transferStock">("createPO")
  const [drawerPayload, setDrawerPayload] = useState<unknown>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check for open query param
  const openParam = searchParams.get("open")
  if (openParam && !drawerOpen) {
    const [mode, id] = openParam.split(":")
    if (mode && id) {
      setDrawerMode(mode as any)
      setDrawerPayload({ id })
      setDrawerOpen(true)
    }
  }

  const handleOpenDrawer = (
    mode: "runForecast" | "createPO" | "bookShipment" | "uploadDocs" | "resolveException" | "transferStock",
    payload?: unknown
  ) => {
    setDrawerMode(mode)
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }

  const handleSubmit = async (payload: unknown) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDrawerOpen(false)
      // TODO: Write to logs
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dashboard-bg min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Row 1: KPI Overview */}
        <Section title="Overview" subtitle="Key performance indicators">
          <KpiStrip items={mockKpiItems} />
        </Section>

        {/* Row 2: Quick Actions */}
        <Section title="Quick Actions" subtitle="Common operations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <RunForecastCard
              onRun={() => handleOpenDrawer("runForecast")}
              isRunning={isSubmitting && drawerMode === "runForecast"}
            />
            <CreatePoCard
              onCreate={() => handleOpenDrawer("createPO")}
              disabled={isSubmitting}
            />
            <BookShipmentCard
              onBook={() => handleOpenDrawer("bookShipment")}
              disabled={isSubmitting}
            />
          </div>
        </Section>

        {/* Row 3: PO Suggestions + Exceptions */}
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-4 xl:col-span-8">
            <Section title="PO Suggestions" subtitle="Recommended purchase orders">
              <PoSuggestionsTable
                data={mockPoSuggestions}
                limit={8}
                density="compact"
                onCreatePO={(row) => handleOpenDrawer("createPO", row)}
                onViewAll={() => router.push("/workbench/inventory/purchase-orders")}
              />
            </Section>
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <Section title="Exceptions" subtitle="Alerts and issues">
              <ExceptionsTable
                data={mockExceptions}
                limit={5}
                density="compact"
                onResolve={(id) => handleOpenDrawer("resolveException", { id })}
                onSnooze={(id, until) => handleOpenDrawer("resolveException", { id, until })}
                onViewAll={() => router.push("/workbench/procurement/suppliers")}
              />
            </Section>
          </div>
        </div>

        {/* Row 4: Upcoming Shipments */}
        <Section title="Upcoming Shipments" subtitle="Planned and in-transit shipments">
          <ShipmentsTable
            data={mockShipments}
            limit={10}
            density="compact"
            onBook={(id) => handleOpenDrawer("bookShipment", { id })}
            onUploadDocs={(id) => handleOpenDrawer("uploadDocs", { id })}
            onMarkReceived={(id) => handleOpenDrawer("bookShipment", { id, action: "markReceived" })}
            onViewAll={() => router.push("/workbench/shipping")}
          />
        </Section>

        {/* Row 5: Recent Orders + Inventory Watchlist */}
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-3 xl:col-span-6">
            <Section title="Recent Orders" subtitle="Last 30 days">
              <OrdersTable
                data={mockOrders}
                limit={10}
                density="compact"
                onOpen={(id) => handleOpenDrawer("bookShipment", { orderId: id })}
                onCreateShipment={(id) => handleOpenDrawer("bookShipment", { orderId: id })}
                onViewAll={() => router.push("/workbench/procurement/suppliers")}
              />
            </Section>
          </div>
          <div className="md:col-span-3 xl:col-span-6">
            <Section title="Inventory Watchlist" subtitle="Low stock and at-risk SKUs">
              <InventoryWatchlist
                data={mockInventoryWatchlist}
                limit={10}
                onCreatePO={(payload) => handleOpenDrawer("createPO", payload)}
                onOpenSku={(sku, location) => router.push(`/workbench/inventory?sku=${sku}&location=${location}`)}
              />
            </Section>
          </div>
        </div>

        {/* Row 6: Imports & Exports Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ImportsActivity
            data={mockImports}
            limit={5}
            onStartImport={() => router.push("/workbench#imports")}
            onViewAll={() => router.push("/workbench")}
          />
          <ExportsActivity
            data={mockExports}
            limit={5}
            onRunExport={() => router.push("/workbench#exports")}
            onViewAll={() => router.push("/workbench")}
          />
        </div>

        {/* Row 7: Activity Feed */}
        <Section title="Activity Feed" subtitle="Recent system activity">
          <ActivityFeed
            data={mockActivityFeed}
            limit={10}
            onClickItem={(id) => {
              const item = mockActivityFeed.find(a => a.id === id)
              if (item) {
                router.push(`/logs?entity=${item.entityType}&id=${item.entityId}`)
              }
            }}
            onViewAll={() => router.push("/logs")}
          />
        </Section>
      </div>

      {/* Action Drawer */}
      <ActionDrawer
        open={drawerOpen}
        mode={drawerMode}
        payload={drawerPayload}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default function WorkbenchPage() {
  return (
    <Suspense
      fallback={
        <div className="dashboard-bg min-h-screen">
          <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      }
    >
      <WorkbenchContent />
    </Suspense>
  )
}
