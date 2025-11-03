import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Package, CreditCard, MessageCircle } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="dashboard-card-title">General Settings</CardTitle>
              <p className="text-sm text-gray-600 dark:text-white">
                Manage your account preferences and application settings.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Account Settings</h3>
                <p className="text-sm text-gray-600 dark:text-white">
                  Configure your account preferences, notifications, and security settings.
                </p>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Edit Profile
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Application Preferences</h3>
                <p className="text-sm text-gray-600 dark:text-white">
                  Customize your dashboard, notifications, and display preferences.
                </p>
                <Button variant="outline">
                  Configure Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="dashboard-card-title">Integrations</CardTitle>
              <p className="text-sm text-gray-600 dark:text-white">
                Connect and manage your integrations.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Alibaba Integration */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Alibaba</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-white">
                      Not connected
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    More
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Connect
                  </Button>
                </div>
              </div>

              {/* Stripe Integration */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Stripe</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-white">
                      Not connected
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Connect
                  </Button>
                </div>
              </div>

              {/* WhatsApp Integration */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">WhatsApp</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-white">
                      Not connected
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
