import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Upload, Search, Building, FileText } from "lucide-react"

export default function SavedPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bookmark className="h-8 w-8 mr-3 text-emerald-500" />
            Saved
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your saved vendors and quotes.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline">
            Select
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendors" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Quotes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vendors..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <div className="h-4 w-4">
                <div className="w-full h-0.5 bg-gray-400 mb-1"></div>
                <div className="w-full h-0.5 bg-gray-400 mb-1"></div>
                <div className="w-full h-0.5 bg-gray-400"></div>
              </div>
            </Button>
          </div>

          {/* Empty State */}
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Building className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No vendors found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No saved vendors available
              </p>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Start Searching
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search quotes..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <div className="h-4 w-4">
                <div className="w-full h-0.5 bg-gray-400 mb-1"></div>
                <div className="w-full h-0.5 bg-gray-400 mb-1"></div>
                <div className="w-full h-0.5 bg-gray-400"></div>
              </div>
            </Button>
          </div>

          {/* Empty State */}
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No quotes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No saved quotes available
              </p>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Start Searching
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
