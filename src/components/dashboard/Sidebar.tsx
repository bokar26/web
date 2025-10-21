"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Search, 
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Building2, 
  Factory, 
  Warehouse, 
  Plane, 
  Truck, 
  ClipboardList,
  Ship, 
  Package, 
  TrendingUp, 
  Calculator, 
  FolderKanban, 
  DollarSign,
  Users, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  Gauge, 
  PackageCheck,
  BoxSelect, 
  AlertTriangle, 
  CloudRain, 
  ScrollText, 
  Plug, 
  User,
  Key, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp
} from "lucide-react"
import { useState, useEffect, useMemo, memo } from "react"
import { useUser } from "@clerk/nextjs"

const NAVIGATION_SECTIONS = [
  {
    type: 'single',
    name: 'Supply Center',
    href: '/dashboard',
    icon: Home,
  },
  {
    type: 'group',
    name: 'Search',
    icon: Search,
    items: [
      { name: 'Suppliers', href: '/dashboard/search/suppliers', icon: Building2 },
      { name: 'Factories', href: '/dashboard/search/factories', icon: Factory },
      { name: 'Warehouses', href: '/dashboard/search/warehouses', icon: Warehouse },
      { name: 'Freight Forwarders', href: '/dashboard/search/freight-forwarders', icon: Plane },
      { name: 'Carriers', href: '/dashboard/search/carriers', icon: Truck },
    ],
  },
  {
    type: 'group',
    name: 'Plan',
    icon: ClipboardList,
    items: [
      { name: 'Shipping Plans', href: '/dashboard/plan/shipping', icon: Ship },
      { name: 'Inventory Plans', href: '/dashboard/plan/inventory', icon: Package },
      { name: 'Demand Forecast', href: '/dashboard/plan/demand', icon: TrendingUp },
      { name: 'Cost Projections', href: '/dashboard/plan/costs', icon: Calculator },
    ],
  },
  {
    type: 'group',
    name: 'Manage',
    icon: FolderKanban,
    items: [
      { name: 'Finances', href: '/dashboard/manage/finances', icon: DollarSign },
      { name: 'Customers', href: '/dashboard/manage/customers', icon: Users },
      { name: 'Purchase Orders', href: '/dashboard/manage/orders', icon: FileText },
      { name: 'Compliance', href: '/dashboard/manage/compliance', icon: ShieldCheck },
    ],
  },
  {
    type: 'group',
    name: 'Performance & SLAs',
    icon: BarChart3,
    items: [
      { name: 'SLA Overview', href: '/dashboard/performance/sla-overview', icon: Gauge },
      { name: 'Supplier Performance', href: '/dashboard/performance/suppliers', icon: TrendingUp },
      { name: 'Delivery Performance', href: '/dashboard/performance/delivery', icon: PackageCheck },
      { name: 'Inventory Availability', href: '/dashboard/performance/inventory', icon: BoxSelect },
      { name: 'Breaches & Exceptions', href: '/dashboard/performance/breaches', icon: AlertTriangle },
      { name: 'Forecast & Risk', href: '/dashboard/performance/forecast', icon: CloudRain },
      { name: 'Governance & Contracts', href: '/dashboard/performance/governance', icon: ScrollText },
    ],
  },
  {
    type: 'group',
    name: 'Settings',
    icon: Settings,
    items: [
      { name: 'Integrations', href: '/dashboard/settings/integrations', icon: Plug },
      { name: 'Account Settings', href: '/dashboard/settings/account', icon: User },
      { name: 'API Keys', href: '/dashboard/settings/api', icon: Key },
      { name: 'Data Sync Status', href: '/dashboard/settings/sync', icon: RefreshCw },
    ],
  },
]

function UserProfileSection({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
          </div>
        )}
      </div>
    )
  }

  const initials = user?.firstName?.[0] + (user?.lastName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || 'U')
  const displayName = user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0] || 'User'
  const email = user?.emailAddresses[0]?.emailAddress

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-white">{initials}</span>
      </div>
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{displayName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</div>
        </div>
      )}
    </div>
  )
}

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sla_sidebar_collapsed") === "true";
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const stored = localStorage.getItem("sla_expanded_sections");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Memoize all navigation items to avoid rebuilds
  const allNavItems = useMemo(() => {
    const items: { href: string }[] = [];
    NAVIGATION_SECTIONS.forEach(section => {
      if (section.type === 'single' && section.href) {
        items.push({ href: section.href });
      } else if (section.type === 'group') {
        section.items?.forEach(item => {
          items.push({ href: item.href });
        });
      }
    });
    return items;
  }, []);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionName)) {
        next.delete(sectionName);
      } else {
        next.add(sectionName);
      }
      return next;
    });
  };

  // Bulk prefetch all routes on idle to ensure instant navigation
  useEffect(() => {
    const prefetchAll = () => {
      allNavItems.forEach(item => {
        router.prefetch(item.href);
      });
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(prefetchAll);
      } else {
        setTimeout(prefetchAll, 100);
      }
    }
  }, [allNavItems, router]);

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      setIsDark(stored === "dark")
      root.classList.toggle("dark", stored === "dark")
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      setIsDark(mq.matches)
      root.classList.toggle("dark", mq.matches)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sla_sidebar_collapsed", String(isCollapsed));
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sla_expanded_sections", JSON.stringify(Array.from(expandedSections)));
    }
  }, [expandedSections]);

  // Keyboard shortcut for toggling sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '[' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        setIsCollapsed(!isCollapsed);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  const toggleTheme = () => {
    const root = document.documentElement
    const newTheme = !isDark
    setIsDark(newTheme)
    root.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-[width] duration-150 ease-out will-change-[width] z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <Link href="/" aria-label="Go to home" className="inline-flex items-center">
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">SLA</div>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {NAVIGATION_SECTIONS.map((section, sectionIndex) => (
          <div key={section.name}>
            {sectionIndex > 0 && (
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
            )}
            
            {section.type === 'single' && section.href ? (
              <Link
                href={section.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                  (pathname === section.href || pathname.startsWith(section.href + "/")) && "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? section.name : undefined}
              >
                <section.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && section.name}
              </Link>
            ) : (
              <div>
                <button
                  onClick={() => toggleSection(section.name)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? section.name : undefined}
                >
                  <section.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{section.name}</span>
                      {expandedSections.has(section.name) ? (
                        <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </>
                  )}
                </button>
                
                {!isCollapsed && expandedSections.has(section.name) && section.items && (
                  <div className="ml-6 space-y-1 mt-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          prefetch={true}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                            "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                            isActive && "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600"
                          )}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <UserProfileSection isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}

export default memo(Sidebar)
