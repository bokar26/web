import {
  Home,
  Wrench,
  CalendarRange,
  Settings,
  User,
  Truck,
  Building2,
  Warehouse,
  Ship,
  Package,
  TrendingUp,
  Calculator,
  FileText,
  Plug,
  Wallet,
  Users,
  ShieldCheck,
  Store,
  ShoppingBag,
  BarChart3,
  Gauge,
  PackageCheck,
  BoxSelect,
  AlertTriangle,
  CloudRain,
  ScrollText,
  Activity,
  Map,
  Calendar,
  Target,
  PackageSearch,
  ClipboardList,
  FolderKanban,
  ListChecks,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type RailSection = "home" | "workbench" | "logs" | "timelines" | "settings"

export interface RailSectionConfig {
  id: RailSection
  label: string
  href: string
  icon: LucideIcon
  match: (path: string) => boolean
}

export interface ContextNavItem {
  type: 'item'
  label: string
  href: string
  icon: LucideIcon
}

export interface ContextNavFolder {
  type: 'folder'
  label: string
  icon?: LucideIcon
  items: ContextNavItem[]
}

export type ContextNavNode = ContextNavItem | ContextNavFolder

export const railSections: RailSectionConfig[] = [
  {
    id: "home",
    label: "Home",
    href: "/dashboard",
    icon: Home,
    match: (p) =>
      p === "/dashboard" ||
      p.startsWith("/dashboard/search") ||
      p.startsWith("/dashboard/plan") ||
      p.startsWith("/dashboard/manage") ||
      p.startsWith("/dashboard/performance") ||
      p.startsWith("/dashboard/overview"),
  },
  {
    id: "workbench",
    label: "Workbench",
    href: "/workbench",
    icon: Wrench,
    match: (p) => p.startsWith("/workbench"),
  },
  {
    id: "logs",
    label: "Logs",
    href: "/logs",
    icon: FileText,
    match: (p) => p.startsWith("/logs"),
  },
  {
    id: "timelines",
    label: "Timelines",
    href: "/dashboard/timelines/roadmaps",
    icon: CalendarRange,
    match: (p) => p.startsWith("/dashboard/timelines"),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    match: (p) => p.startsWith("/dashboard/settings"),
  },
]

export const contextNavBySection: Record<RailSection, ContextNavNode[]> = {
  home: [
    // Supply Center (top-level item)
    { type: 'item', label: "Supply Center", href: "/dashboard", icon: Home },
    
    // Planning Folder
    {
      type: 'folder',
      label: "Planning",
      icon: ClipboardList,
      items: [
        { type: 'item', label: "Shipping Plans", href: "/dashboard/plan/shipping", icon: Ship },
        { type: 'item', label: "Inventory Plans", href: "/dashboard/plan/inventory", icon: Package },
        { type: 'item', label: "Demand Forecast", href: "/dashboard/plan/demand", icon: TrendingUp },
      ],
    },
    
    // Manage Folder
    {
      type: 'folder',
      label: "Manage",
      icon: FolderKanban,
      items: [
        { type: 'item', label: "Compliance", href: "/dashboard/manage/compliance", icon: ShieldCheck },
        { type: 'item', label: "Products", href: "/dashboard/manage/products", icon: ShoppingBag },
      ],
    },
    
    // Performance Folder
    {
      type: 'folder',
      label: "Performance",
      icon: BarChart3,
      items: [
        { type: 'item', label: "SLA Overview", href: "/dashboard/performance/sla-overview", icon: Gauge },
        { type: 'item', label: "Supplier Performance", href: "/dashboard/performance/suppliers", icon: TrendingUp },
        { type: 'item', label: "Delivery Performance", href: "/dashboard/performance/delivery", icon: PackageCheck },
        { type: 'item', label: "Inventory Availability", href: "/dashboard/performance/inventory", icon: BoxSelect },
        { type: 'item', label: "Breaches & Exceptions", href: "/dashboard/performance/breaches", icon: AlertTriangle },
        { type: 'item', label: "Forecast & Risk", href: "/dashboard/performance/forecast", icon: CloudRain },
        { type: 'item', label: "Governance & Contracts", href: "/dashboard/performance/governance", icon: ScrollText },
      ],
    },
  ],
  workbench: [
    { type: 'item', label: "Overview", href: "/workbench", icon: Wrench },
    {
      type: 'folder',
      label: "Procurement",
      icon: PackageSearch,
      items: [
        { type: 'item', label: "Overview", href: "/workbench/procurement", icon: PackageSearch },
        { type: 'item', label: "Suppliers", href: "/workbench/procurement/suppliers", icon: Building2 },
        { type: 'item', label: "Warehouses", href: "/workbench/procurement/warehouses", icon: Warehouse },
        { type: 'item', label: "Logistics", href: "/workbench/procurement/logistics", icon: Truck },
      ],
    },
    {
      type: 'folder',
      label: "Contacts",
      icon: Users,
      items: [
        { type: 'item', label: "Vendors", href: "/workbench/contacts/vendors", icon: Store },
        { type: 'item', label: "Customers", href: "/workbench/contacts/customers", icon: Users },
      ],
    },
    {
      type: 'folder',
      label: "Inventory",
      icon: Package,
      items: [
        { type: 'item', label: "Dashboard", href: "/workbench/inventory", icon: Package },
        { type: 'item', label: "Purchase Orders", href: "/workbench/inventory/purchase-orders", icon: FileText },
      ],
    },
    { type: 'item', label: "Shipping", href: "/workbench/shipping", icon: Ship },
    { type: 'item', label: "Accounting", href: "/workbench/accounting", icon: Calculator },
  ],
  logs: [], // Single page, no sub-nav
  settings: [
    { type: 'item', label: "General", href: "/dashboard/settings/general", icon: Settings },
    { type: 'item', label: "Automations", href: "/dashboard/settings/automations", icon: ListChecks },
    { type: 'item', label: "Integrations", href: "/dashboard/settings/integrations", icon: Plug },
  ],
  timelines: [
    {
      type: 'folder',
      label: "Schedules",
      icon: Calendar,
      items: [
        { type: 'item', label: "Project Roadmaps", href: "/dashboard/timelines/roadmaps", icon: Map },
        { type: 'item', label: "Schedules", href: "/dashboard/timelines/schedules", icon: Calendar },
        { type: 'item', label: "Milestones", href: "/dashboard/timelines/milestones", icon: Target },
      ],
    },
  ],
}
