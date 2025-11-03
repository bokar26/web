"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Plug, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Database,
  Cloud,
  Zap,
  Shield,
  Activity
} from "lucide-react"

// Mock data for integrations
const integrations = [
  {
    id: 'erp-sap',
    name: 'SAP ERP',
    category: 'ERP',
    description: 'Connect with SAP ERP for real-time inventory and order data',
    status: 'connected',
    lastSync: '2024-01-20T10:30:00Z',
    syncFrequency: 'Real-time',
    health: 'excellent',
    icon: Database,
    features: ['Inventory Sync', 'Order Management', 'Financial Data', 'Supplier Portal']
  },
  {
    id: 'wms-oracle',
    name: 'Oracle WMS',
    category: 'Warehouse Management',
    description: 'Warehouse management system integration for inventory tracking',
    status: 'connected',
    lastSync: '2024-01-20T09:15:00Z',
    syncFrequency: 'Every 15 minutes',
    health: 'good',
    icon: Cloud,
    features: ['Inventory Tracking', 'Location Management', 'Pick & Pack', 'Shipping Labels']
  },
  {
    id: 'tms-jda',
    name: 'JDA Transportation',
    category: 'Transportation',
    description: 'Transportation management system for logistics optimization',
    status: 'connected',
    lastSync: '2024-01-20T08:45:00Z',
    syncFrequency: 'Every 30 minutes',
    health: 'good',
    icon: Zap,
    features: ['Route Optimization', 'Carrier Management', 'Freight Tracking', 'Cost Analysis']
  },
  {
    id: 'bi-tableau',
    name: 'Tableau BI',
    category: 'Business Intelligence',
    description: 'Business intelligence platform for advanced analytics',
    status: 'connected',
    lastSync: '2024-01-20T07:20:00Z',
    syncFrequency: 'Daily',
    health: 'excellent',
    icon: Activity,
    features: ['Custom Dashboards', 'Advanced Analytics', 'Report Automation', 'Data Visualization']
  },
  {
    id: 'security-okta',
    name: 'Okta SSO',
    category: 'Security',
    description: 'Single sign-on authentication and user management',
    status: 'connected',
    lastSync: '2024-01-20T06:00:00Z',
    syncFrequency: 'Real-time',
    health: 'excellent',
    icon: Shield,
    features: ['Single Sign-On', 'User Provisioning', 'Multi-Factor Auth', 'Access Control']
  },
  {
    id: 'crm-salesforce',
    name: 'Salesforce CRM',
    category: 'Customer Management',
    description: 'Customer relationship management integration',
    status: 'disconnected',
    lastSync: '2024-01-18T14:30:00Z',
    syncFrequency: 'Manual',
    health: 'warning',
    icon: Database,
    features: ['Customer Data', 'Sales Pipeline', 'Lead Management', 'Contact Sync']
  },
  {
    id: 'api-custom',
    name: 'Custom API',
    category: 'Custom',
    description: 'Custom API integration for proprietary systems',
    status: 'error',
    lastSync: '2024-01-19T16:45:00Z',
    syncFrequency: 'Every hour',
    health: 'error',
    icon: Settings,
    features: ['Custom Data Sync', 'Proprietary Format', 'Legacy System', 'Manual Mapping']
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white'
    case 'disconnected': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-white'
    case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-white'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white'
  }
}

const getHealthColor = (health: string) => {
  switch (health) {
    case 'excellent': return 'text-emerald-600 dark:text-emerald-400'
    case 'good': return 'text-blue-600 dark:text-blue-400'
    case 'warning': return 'text-yellow-600 dark:text-yellow-400'
    case 'error': return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-600 dark:text-white'
  }
}

const getHealthIcon = (health: string) => {
  switch (health) {
    case 'excellent': return CheckCircle
    case 'good': return CheckCircle
    case 'warning': return AlertTriangle
    case 'error': return XCircle
    default: return AlertTriangle
  }
}

export default function IntegrationsPage() {
  const [enabledIntegrations, setEnabledIntegrations] = useState<string[]>([
    'erp-sap', 'wms-oracle', 'tms-jda', 'bi-tableau', 'security-okta'
  ])

  const toggleIntegration = (id: string) => {
    setEnabledIntegrations(prev => 
      prev.includes(id) 
        ? prev.filter(integrationId => integrationId !== id)
        : [...prev, id]
    )
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const totalCount = integrations.length
  const errorCount = integrations.filter(i => i.status === 'error').length

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Integrations</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-200 dark:border-gray-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plug className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Total Integrations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <Plug className="h-3 w-3 mr-1" />
                  {connectedCount} active
                </p>
              </div>
              <Plug className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Connected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{connectedCount}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {Math.round((connectedCount / totalCount) * 100)}% of total
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Last Sync</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">2 min ago</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  Real-time sync
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Issues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{errorCount}</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const IconComponent = integration.icon
          const HealthIcon = getHealthIcon(integration.health)
          const isEnabled = enabledIntegrations.includes(integration.id)
          
          return (
            <Card key={integration.id} className="dashboard-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                      <IconComponent className="h-6 w-6 text-gray-600 dark:text-white" />
                    </div>
                    <div>
                      <CardTitle className="dashboard-card-title">{integration.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-white">{integration.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </Badge>
                    <HealthIcon className={`h-4 w-4 ${getHealthColor(integration.health)}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-white mb-4">{integration.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-white">Sync Frequency</span>
                    <span className="font-medium text-gray-900 dark:text-white">{integration.syncFrequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-white">Last Sync</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(integration.lastSync).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-white">Health Status</span>
                    <span className={`font-medium ${getHealthColor(integration.health)}`}>
                      {integration.health.charAt(0).toUpperCase() + integration.health.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-white mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`enable-${integration.id}`}
                      checked={isEnabled}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                    />
                    <Label htmlFor={`enable-${integration.id}`} className="text-sm text-gray-700 dark:text-white">
                      Enable Integration
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-200 dark:border-gray-800">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-200 dark:border-gray-800">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Integration Status Summary */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Integration Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Connected Integrations</h3>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                {connectedCount} integrations are currently connected and syncing data successfully.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100">Disconnected Integrations</h3>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {integrations.filter(i => i.status === 'disconnected').length} integrations are disconnected and need attention.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="font-medium text-red-900 dark:text-red-100">Error Status</h3>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                {errorCount} integrations have errors and require immediate attention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
