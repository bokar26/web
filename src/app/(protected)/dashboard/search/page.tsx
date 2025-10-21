import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Building2, 
  Factory, 
  Warehouse, 
  Plane, 
  Truck,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Users
} from "lucide-react"

export default function SearchHubPage() {
  const searchCategories = [
    {
      name: "Suppliers",
      href: "/dashboard/search/suppliers",
      icon: Building2,
      description: "Find and compare suppliers by cost, quality, and performance",
      stats: "1,247 suppliers",
      color: "text-blue-600"
    },
    {
      name: "Factories",
      href: "/dashboard/search/factories", 
      icon: Factory,
      description: "Discover manufacturing partners with specific capabilities",
      stats: "892 factories",
      color: "text-green-600"
    },
    {
      name: "Warehouses",
      href: "/dashboard/search/warehouses",
      icon: Warehouse,
      description: "Locate storage and fulfillment facilities worldwide",
      stats: "156 warehouses",
      color: "text-purple-600"
    },
    {
      name: "Freight Forwarders",
      href: "/dashboard/search/freight-forwarders",
      icon: Plane,
      description: "Connect with logistics providers for shipping solutions",
      stats: "89 forwarders",
      color: "text-orange-600"
    },
    {
      name: "Carriers",
      href: "/dashboard/search/carriers",
      icon: Truck,
      description: "Find reliable transportation partners for your shipments",
      stats: "234 carriers",
      color: "text-red-600"
    }
  ]

  const quickStats = [
    { label: "Total Partners", value: "2,618", icon: Users },
    { label: "Avg. Cost Savings", value: "23%", icon: DollarSign },
    { label: "Time to Find", value: "2.3 days", icon: Clock },
    { label: "Success Rate", value: "94%", icon: TrendingUp }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Search className="h-8 w-8 mr-3 text-emerald-500" />
          Search Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI-powered search across your entire supply chain network. Find suppliers, factories, warehouses, and logistics partners.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <stat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Search Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchCategories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div className="ml-3">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.stats}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Cotton t-shirt suppliers in Bangladesh</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Warehouses near Los Angeles port</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Freight forwarders China to USA</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
