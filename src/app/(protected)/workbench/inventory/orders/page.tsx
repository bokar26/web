"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  DollarSign,
  Package,
  Activity,
  CheckCircle,
  RefreshCw,
  ClipboardList,
  ArrowLeft,
  Save,
  X,
} from "lucide-react"

type OrderStatus = "pending" | "in-progress" | "completed" | "delayed"
type PurchasingIntent = "high" | "medium" | "low" | "unsure" | "unlikely"
type OrderLifecycleStatus = "sampling" | "inquiring" | "production" | "awaiting reorder" | "done"

type CustomerInfo = {
  name: string
  contact: string
  billingAddress: string
  shippingAddress: string
  saveCustomer: boolean
}

type ExtendedOrderFields = {
  deliveryAddress: string
  targetPrice?: number
  purchasingIntent: PurchasingIntent
  currentStatus: OrderLifecycleStatus
  quotedCost?: number
  sampleCost?: number
  sampleTimeline?: string
  productionTimeline?: string
  purchasingFrequency?: string
  additionalNotes?: string
  customer: CustomerInfo
}

type Order = {
  id: string
  name: string
  product: string
  quantity: number
  unitPrice: number
  currency: string
  location: string
  status: OrderStatus
  notes?: string
} & ExtendedOrderFields

type OrderFormState = {
  name: string
  product: string
  quantity: string
  deliveryAddress: string
  status: OrderStatus
  notes: string
  targetPrice: string
  purchasingIntent: PurchasingIntent
  currentStatus: OrderLifecycleStatus
  quotedCost: string
  sampleCost: string
  sampleTimeline: string
  productionTimeline: string
  purchasingFrequency: string
  additionalNotes: string
  customer: CustomerInfo
}

const initialOrders: Order[] = [
  {
    id: "ord-001",
    name: "Spring Refresh Drop",
    product: "Cotton T-Shirts",
    quantity: 1200,
    unitPrice: 11.5,
    currency: "USD",
    location: "Los Angeles, CA",
    deliveryAddress: "Los Angeles, CA",
    status: "in-progress",
    notes: "Awaiting final QA results",
    targetPrice: 11.5,
    purchasingIntent: "high",
    currentStatus: "production",
    quotedCost: 10.75,
    sampleCost: 1500,
    sampleTimeline: "Completed Jan 5",
    productionTimeline: "ETA Feb 12",
    purchasingFrequency: "Quarterly",
    additionalNotes: "Monitor dye lot consistency",
    customer: {
      name: "Supply Center - LA Retail",
      contact: "la-retail@supply.com",
      billingAddress: "100 Main St, Los Angeles, CA",
      shippingAddress: "215 Industrial Blvd, Los Angeles, CA",
      saveCustomer: true,
    },
  },
  {
    id: "ord-002",
    name: "Premium Denim Refill",
    product: "Selvedge Jeans",
    quantity: 600,
    unitPrice: 42,
    currency: "USD",
    location: "Dallas, TX",
    deliveryAddress: "Dallas, TX",
    status: "pending",
    notes: "PO issued, supplier confirmation in progress",
    targetPrice: 41.5,
    purchasingIntent: "medium",
    currentStatus: "inquiring",
    quotedCost: 41,
    sampleCost: 900,
    sampleTimeline: "Awaiting approval",
    productionTimeline: "ETA Mar 3",
    purchasingFrequency: "Bi-Annual",
    additionalNotes: "Need indigo wash sample",
    customer: {
      name: "Central Denim Co.",
      contact: "orders@centraldenim.com",
      billingAddress: "500 Elm St, Dallas, TX",
      shippingAddress: "500 Elm St, Dallas, TX",
      saveCustomer: true,
    },
  },
  {
    id: "ord-003",
    name: "Holiday Essentials",
    product: "Wool Sweaters",
    quantity: 450,
    unitPrice: 38.5,
    currency: "USD",
    location: "Chicago, IL",
    deliveryAddress: "Chicago, IL",
    status: "completed",
    notes: "Delivered and booked",
    targetPrice: 38.5,
    purchasingIntent: "high",
    currentStatus: "done",
    quotedCost: 38,
    sampleCost: 700,
    sampleTimeline: "Completed Oct 11",
    productionTimeline: "Completed Nov 20",
    purchasingFrequency: "Seasonal",
    additionalNotes: "Customer requested reorder reminder",
    customer: {
      name: "North Markets",
      contact: "buying@northmarkets.com",
      billingAddress: "45 Lakeshore Dr, Chicago, IL",
      shippingAddress: "120 Distribution Way, Joliet, IL",
      saveCustomer: true,
    },
  },
]

const statusStyles: Record<OrderStatus, string> = {
  pending:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-900",
  "in-progress":
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-900",
  completed:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-900",
  delayed:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-900",
}

const purchasingIntentOptions: PurchasingIntent[] = ["high", "medium", "low", "unsure", "unlikely"]
const lifecycleOptions: OrderLifecycleStatus[] = ["sampling", "inquiring", "production", "awaiting reorder", "done"]

const metricCards = [
  {
    label: "Orders",
    icon: ClipboardList,
    accessor: (orders: Order[]) => orders.length,
  },
  {
    label: "Revenue",
    icon: DollarSign,
    accessor: (orders: Order[]) => orders.reduce((sum, order) => sum + order.quantity * order.unitPrice, 0),
    formatter: (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
  },
  {
    label: "Products Sold",
    icon: Package,
    accessor: (orders: Order[]) => orders.reduce((sum, order) => sum + order.quantity, 0),
  },
  {
    label: "Active Orders",
    icon: Activity,
    accessor: (orders: Order[]) =>
      orders.filter((order) => order.status === "in-progress" || order.status === "pending").length,
  },
  {
    label: "Completed",
    icon: CheckCircle,
    accessor: (orders: Order[]) => orders.filter((order) => order.status === "completed").length,
  },
]

const createBlankCustomer = (): CustomerInfo => ({
  name: "",
  contact: "",
  billingAddress: "",
  shippingAddress: "",
  saveCustomer: false,
})

const createBlankForm = (): OrderFormState => ({
  name: "",
  product: "",
  quantity: "",
  deliveryAddress: "",
  status: "pending",
  notes: "",
  targetPrice: "",
  purchasingIntent: "medium",
  currentStatus: "inquiring",
  quotedCost: "",
  sampleCost: "",
  sampleTimeline: "",
  productionTimeline: "",
  purchasingFrequency: "",
  additionalNotes: "",
  customer: createBlankCustomer(),
})

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `order-${Date.now()}`
}

export default function InventoryOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [mode, setMode] = useState<"list" | "create">("list")
  const [orderForm, setOrderForm] = useState<OrderFormState>(() => createBlankForm())
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [detailForm, setDetailForm] = useState<Order | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [isUpdatingDetail, setIsUpdatingDetail] = useState(false)

  const selectedOrder = useMemo(
    () => (selectedOrderId ? orders.find((order) => order.id === selectedOrderId) ?? null : null),
    [orders, selectedOrderId],
  )

  useEffect(() => {
    setDetailForm(selectedOrder ? { ...selectedOrder } : null)
  }, [selectedOrder])

  const metrics = useMemo(() => {
    return metricCards.map((card) => {
      const rawValue = card.accessor(orders)
      const value =
        "formatter" in card && typeof card.formatter === "function"
          ? card.formatter(rawValue as number)
          : rawValue.toLocaleString()
      return { label: card.label, icon: card.icon, value }
    })
  }, [orders])

  const handleFormInput = (
    field: keyof OrderFormState,
    value: string | OrderStatus | PurchasingIntent | OrderLifecycleStatus,
  ) => {
    setOrderForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomerInput = (field: keyof CustomerInfo, value: string | boolean) => {
    setOrderForm((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value,
      },
    }))
  }

  const handleCreateOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!orderForm.name || !orderForm.product || !orderForm.quantity || !orderForm.deliveryAddress) {
      return
    }

    setIsSavingOrder(true)
    const quantity = Number(orderForm.quantity) || 0
    const targetPrice = Number(orderForm.targetPrice) || 0

    const newOrder: Order = {
      id: generateId(),
      name: orderForm.name.trim(),
      product: orderForm.product.trim(),
      quantity,
      unitPrice: targetPrice || 0,
      currency: "USD",
      location: orderForm.deliveryAddress.trim(),
      deliveryAddress: orderForm.deliveryAddress.trim(),
      status: orderForm.status,
      notes: orderForm.notes,
      targetPrice: targetPrice || undefined,
      purchasingIntent: orderForm.purchasingIntent,
      currentStatus: orderForm.currentStatus,
      quotedCost: orderForm.quotedCost ? Number(orderForm.quotedCost) : undefined,
      sampleCost: orderForm.sampleCost ? Number(orderForm.sampleCost) : undefined,
      sampleTimeline: orderForm.sampleTimeline || undefined,
      productionTimeline: orderForm.productionTimeline || undefined,
      purchasingFrequency: orderForm.purchasingFrequency || undefined,
      additionalNotes: orderForm.additionalNotes || undefined,
      customer: {
        name: orderForm.customer.name.trim(),
        contact: orderForm.customer.contact.trim(),
        billingAddress: orderForm.customer.billingAddress.trim(),
        shippingAddress: orderForm.customer.shippingAddress.trim(),
        saveCustomer: orderForm.customer.saveCustomer,
      },
    }

    setOrders((prev) => [...prev, newOrder])
    setOrderForm(createBlankForm())
    setMode("list")
    setSelectedOrderId(newOrder.id)
    setIsSavingOrder(false)
  }

  const handleDetailChange = (
    field: keyof ExtendedOrderFields | "notes" | "status",
    value: string | number | PurchasingIntent | OrderLifecycleStatus | OrderStatus,
  ) => {
    setDetailForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleDetailCustomerChange = (field: keyof CustomerInfo, value: string | boolean) => {
    setDetailForm((prev) =>
      prev
        ? {
            ...prev,
            customer: {
              ...prev.customer,
              [field]: value,
            },
          }
        : prev,
    )
  }

  const handleUpdateOrder = async () => {
    if (!detailForm) return
    setIsUpdatingDetail(true)
    setOrders((prev) => prev.map((order) => (order.id === detailForm.id ? detailForm : order)))
    setIsUpdatingDetail(false)
  }

  const renderListView = () => (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create, monitor, and fulfill direct-to-store and wholesale orders.
          </p>
        </div>
        <Button className="bg-[#00FF7F] text-black hover:brightness-95" onClick={() => setMode("create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label} className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dashboard-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Orders</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Track production, fulfillment, and delivery status across markets.
            </p>
          </div>
          <Button variant="outline" className="border-gray-300 dark:border-gray-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Status
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-900/40 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Order Name</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3 text-right">Total $</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              {orders.map((order) => {
                const total = order.quantity * order.unitPrice
                const isActive = selectedOrderId === order.id
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer transition-colors ${
                      isActive ? "bg-gray-100 dark:bg-gray-900/50" : "hover:bg-gray-50 dark:hover:bg-gray-900/40"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{order.name}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.product}</td>
                    <td className="px-6 py-4 text-right text-gray-900 dark:text-white font-semibold">
                      {currencyFormatter.format(total)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.location}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={statusStyles[order.status]}>
                        {order.status.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.notes || "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {detailForm && (
        <Card className="dashboard-card border border-emerald-200 dark:border-emerald-900/40">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">Order Details</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{detailForm.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tap fields below to update delivery or production info.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrderId(null)}>
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
              <Button size="sm" onClick={handleUpdateOrder} disabled={isUpdatingDetail}>
                <Save className="h-4 w-4 mr-1" />
                {isUpdatingDetail ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={detailForm.status} onValueChange={(value: OrderStatus) => handleDetailChange("status", value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-950">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusStyles).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select
                  value={detailForm.currentStatus}
                  onValueChange={(value: OrderLifecycleStatus) => handleDetailChange("currentStatus", value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-950">
                    <SelectValue placeholder="Current status" />
                  </SelectTrigger>
                  <SelectContent>
                    {lifecycleOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Delivery Address</Label>
                <Textarea
                  value={detailForm.deliveryAddress}
                  onChange={(event) => handleDetailChange("deliveryAddress", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={detailForm.notes || ""}
                  onChange={(event) => handleDetailChange("notes", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Target Price (USD)</Label>
                <Input
                  type="number"
                  min={0}
                  value={detailForm.targetPrice ?? ""}
                  onChange={(event) => handleDetailChange("targetPrice", Number(event.target.value) || 0)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Quoted Cost</Label>
                <Input
                  type="number"
                  min={0}
                  value={detailForm.quotedCost ?? ""}
                  onChange={(event) => handleDetailChange("quotedCost", Number(event.target.value) || 0)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Sample Cost</Label>
                <Input
                  type="number"
                  min={0}
                  value={detailForm.sampleCost ?? ""}
                  onChange={(event) => handleDetailChange("sampleCost", Number(event.target.value) || 0)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Sample Timeline</Label>
                <Input
                  value={detailForm.sampleTimeline ?? ""}
                  onChange={(event) => handleDetailChange("sampleTimeline", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Production Timeline</Label>
                <Input
                  value={detailForm.productionTimeline ?? ""}
                  onChange={(event) => handleDetailChange("productionTimeline", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Purchasing Frequency</Label>
                <Input
                  value={detailForm.purchasingFrequency ?? ""}
                  onChange={(event) => handleDetailChange("purchasingFrequency", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer Contact</Label>
                <Input
                  value={detailForm.customer.contact}
                  onChange={(event) => handleDetailCustomerChange("contact", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={detailForm.additionalNotes ?? ""}
                  onChange={(event) => handleDetailChange("additionalNotes", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )

  const renderCreateView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setMode("list")} className="text-gray-600 dark:text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">Create Order</span>
      </div>

      <form onSubmit={handleCreateOrder} className="space-y-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-base">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Order Name</Label>
                <Input
                  value={orderForm.name}
                  onChange={(event) => handleFormInput("name", event.target.value)}
                  placeholder="FW25 Drop"
                  required
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Input
                  value={orderForm.product}
                  onChange={(event) => handleFormInput("product", event.target.value)}
                  placeholder="Performance Shorts"
                  required
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={0}
                  value={orderForm.quantity}
                  onChange={(event) => handleFormInput("quantity", event.target.value)}
                  placeholder="500"
                  required
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Price (USD)</Label>
                <Input
                  type="number"
                  min={0}
                  value={orderForm.targetPrice}
                  onChange={(event) => handleFormInput("targetPrice", event.target.value)}
                  placeholder="25"
                  required
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Delivery Address</Label>
              <Textarea
                value={orderForm.deliveryAddress}
                onChange={(event) => handleFormInput("deliveryAddress", event.target.value)}
                placeholder="123 Fulfillment Ave, Memphis, TN"
                required
                className="bg-white dark:bg-gray-950"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Order Status</Label>
                <Select value={orderForm.status} onValueChange={(value: OrderStatus) => handleFormInput("status", value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-950">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusStyles).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select
                  value={orderForm.currentStatus}
                  onValueChange={(value: OrderLifecycleStatus) => handleFormInput("currentStatus", value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-950">
                    <SelectValue placeholder="Current status" />
                  </SelectTrigger>
                  <SelectContent>
                    {lifecycleOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Purchasing Intent</Label>
                <Select
                  value={orderForm.purchasingIntent}
                  onValueChange={(value: PurchasingIntent) => handleFormInput("purchasingIntent", value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-950">
                    <SelectValue placeholder="Intent" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchasingIntentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={orderForm.notes}
                  onChange={(event) => handleFormInput("notes", event.target.value)}
                  placeholder="Add shipment instructions, QA reminders, etc."
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={orderForm.customer.name}
                  onChange={(event) => handleCustomerInput("name", event.target.value)}
                  placeholder="Customer or account name"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Info</Label>
                <Input
                  value={orderForm.customer.contact}
                  onChange={(event) => handleCustomerInput("contact", event.target.value)}
                  placeholder="buyer@email.com | +1 (555) 555-1234"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Billing Address</Label>
              <Textarea
                value={orderForm.customer.billingAddress}
                onChange={(event) => handleCustomerInput("billingAddress", event.target.value)}
                className="bg-white dark:bg-gray-950"
              />
            </div>
            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <Textarea
                value={orderForm.customer.shippingAddress}
                onChange={(event) => handleCustomerInput("shippingAddress", event.target.value)}
                className="bg-white dark:bg-gray-950"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="saveCustomer"
                checked={orderForm.customer.saveCustomer}
                onCheckedChange={(checked) => handleCustomerInput("saveCustomer", Boolean(checked))}
              />
              <Label htmlFor="saveCustomer" className="text-sm text-gray-600 dark:text-gray-400">
                Save customer profile for next order
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quoted Cost</Label>
                <Input
                  type="number"
                  min={0}
                  value={orderForm.quotedCost}
                  onChange={(event) => handleFormInput("quotedCost", event.target.value)}
                  placeholder="Leave blank if unknown"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Sample Cost</Label>
                <Input
                  type="number"
                  min={0}
                  value={orderForm.sampleCost}
                  onChange={(event) => handleFormInput("sampleCost", event.target.value)}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Sample Timeline</Label>
                <Input
                  value={orderForm.sampleTimeline}
                  onChange={(event) => handleFormInput("sampleTimeline", event.target.value)}
                  placeholder="e.g., Samples ship Mar 2"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Production Timeline</Label>
                <Input
                  value={orderForm.productionTimeline}
                  onChange={(event) => handleFormInput("productionTimeline", event.target.value)}
                  placeholder="e.g., Bulk ready Apr 18"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Purchasing Frequency</Label>
              <Input
                value={orderForm.purchasingFrequency}
                onChange={(event) => handleFormInput("purchasingFrequency", event.target.value)}
                placeholder="Monthly, Seasonal, etc."
                className="bg-white dark:bg-gray-950"
              />
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                value={orderForm.additionalNotes}
                onChange={(event) => handleFormInput("additionalNotes", event.target.value)}
                placeholder="Optional - QA requirements, compliance reminders, etc."
                className="bg-white dark:bg-gray-950"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => setMode("list")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSavingOrder}>
            {isSavingOrder ? "Saving..." : "Save Order"}
          </Button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {mode === "create" ? renderCreateView() : renderListView()}
    </div>
  )
}


