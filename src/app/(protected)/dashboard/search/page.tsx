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
      description: "Find and compare suppliers and manufacturing partners by cost, quality, and performance",
      stats: "2,139 partners",
      color: "text-blue-600"
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
      name: "Logistics",
      href: "/dashboard/search/logistics",
      icon: Truck,
      description: "Connect with freight forwarders, carriers, and shipping partners",
      stats: "323 partners",
      color: "text-orange-600"
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
        <p className="text-gray-600 dark:text-white mt-2">
          AI-powered search across your entire supply chain network. Find suppliers, factories, warehouses, and logistics partners.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index} className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <stat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-white">{stat.label}</p>
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
              <Card className="dashboard-card hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 dark:bg-gray-950 rounded-lg">
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div className="ml-3">
                        <CardTitle className="dashboard-card-title">{category.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-white">{category.stats}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-600 dark:text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-white">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Recent Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-600 dark:text-white mr-3" />
                <span className="text-sm text-gray-700 dark:text-white">Cotton t-shirt suppliers in Bangladesh</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-white">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-600 dark:text-white mr-3" />
                <span className="text-sm text-gray-700 dark:text-white">Warehouses near Los Angeles port</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-white">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-600 dark:text-white mr-3" />
                <span className="text-sm text-gray-700 dark:text-white">Freight forwarders China to USA</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-white">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
