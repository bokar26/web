import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Clock, MapPin } from "lucide-react"

export default function LogisticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Truck className="h-8 w-8 mr-3 text-emerald-500" />
            SLA Fulfillment Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track shipments and plan routes with intelligent logistics planning.
          </p>
        </div>
      </div>

      {/* Time Saved Progress */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              TIME SAVED WITH SLA (FULFILLMENT)
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Saved: 6h</span>
              <span className="text-gray-600 dark:text-gray-400">Without SLA: 18h</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '33%' }} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total time spent: 12h
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes and Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routes */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Routes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Shanghai → LA</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ETA 16-22 days</div>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Ho Chi Minh → NY</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ETA 16-22 days</div>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Shenzhen → SF</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ETA 16-22 days</div>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Planning */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Route Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                Fill with Saved Vendor
              </Button>
              <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                Fill with Saved Quote
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Origin Country</label>
                  <input 
                    type="text" 
                    defaultValue="China" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination Country</label>
                  <input 
                    type="text" 
                    defaultValue="USA" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Incoterm</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>EXW</option>
                  <option>FOB</option>
                  <option>CIF</option>
                  <option>DDP</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Buyer picks up at seller&apos;s site; buyer handles export. Required: origin_city Optional: origin_port, dest_city, dest_port
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Origin City *</label>
                  <input 
                    type="text" 
                    placeholder="Shanghai" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Origin Port</label>
                  <input 
                    type="text" 
                    placeholder="Shanghai Port" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination City</label>
                  <input 
                    type="text" 
                    placeholder="Los Angeles" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination Port</label>
                  <input 
                    type="text" 
                    placeholder="Los Angeles Port" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Type</label>
                  <input 
                    type="text" 
                    placeholder="Apparel" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Description</label>
                  <input 
                    type="text" 
                    placeholder="Cotton t-shirts" 
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                Plan route with SLA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
