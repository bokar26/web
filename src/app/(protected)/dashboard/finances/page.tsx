import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Download, Plus, TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react"

export default function FinancesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="h-8 w-8 mr-3 text-emerald-500" />
            Financial Management
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.6%
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
                <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +9.0%
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold text-lg">📄</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">
                  Net Profit
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
                <p className="text-sm text-gray-500 dark:text-white">0% margin</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">
                  Cash Flow
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
                <p className="text-sm text-gray-500 dark:text-white">0.0%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Vendor/Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty state - no rows */}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card className="text-center py-12">
        <CardContent>
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-950 rounded-full flex items-center justify-center">
            <DollarSign className="h-12 w-12 text-gray-600 dark:text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No transactions found
          </h3>
          <p className="text-gray-600 dark:text-white mb-6">
            Get started by adding your first transaction.
          </p>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Transaction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
