"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Database,
  Cloud,
  Activity,
  TrendingUp,
  TrendingDown,
  Pause,
  Play,
  Settings
} from "lucide-react"

// Mock data for sync status
const syncStatus = [
  {
    id: 'sync-001',
    name: 'SAP ERP Integration',
    type: 'ERP',
    status: 'syncing',
    lastSync: '2024-01-20T10:30:00Z',
    nextSync: '2024-01-20T10:35:00Z',
    progress: 75,
    recordsProcessed: 1250,
    totalRecords: 1667,
    syncDuration: '2m 15s',
    successRate: 98.5,
    errorCount: 19,
    dataSize: '45.2 MB',
    icon: Database
  },
  {
    id: 'sync-002',
    name: 'Oracle WMS',
    type: 'Warehouse Management',
    status: 'completed',
    lastSync: '2024-01-20T09:15:00Z',
    nextSync: '2024-01-20T09:30:00Z',
    progress: 100,
    recordsProcessed: 890,
    totalRecords: 890,
    syncDuration: '1m 45s',
    successRate: 100,
    errorCount: 0,
    dataSize: '12.8 MB',
    icon: Cloud
  },
  {
    id: 'sync-003',
    name: 'JDA Transportation',
    type: 'Transportation',
    status: 'error',
    lastSync: '2024-01-20T08:45:00Z',
    nextSync: '2024-01-20T09:15:00Z',
    progress: 45,
    recordsProcessed: 234,
    totalRecords: 520,
    syncDuration: '0m 32s',
    successRate: 89.2,
    errorCount: 25,
    dataSize: '8.7 MB',
    icon: Activity
  },
  {
    id: 'sync-004',
    name: 'Tableau BI',
    type: 'Business Intelligence',
    status: 'paused',
    lastSync: '2024-01-20T07:20:00Z',
    nextSync: 'Paused',
    progress: 0,
    recordsProcessed: 0,
    totalRecords: 0,
    syncDuration: '0m 0s',
    successRate: 0,
    errorCount: 0,
    dataSize: '0 MB',
    icon: Database
  },
  {
    id: 'sync-005',
    name: 'Salesforce CRM',
    type: 'Customer Management',
    status: 'scheduled',
    lastSync: '2024-01-19T16:30:00Z',
    nextSync: '2024-01-20T12:00:00Z',
    progress: 0,
    recordsProcessed: 0,
    totalRecords: 0,
    syncDuration: '0m 0s',
    successRate: 0,
    errorCount: 0,
    dataSize: '0 MB',
    icon: Cloud
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'syncing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'scheduled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle
    case 'syncing': return RefreshCw
    case 'error': return XCircle
    case 'paused': return Pause
    case 'scheduled': return Clock
    default: return Clock
  }
}

export default function DataSyncStatusPage() {
  const [autoRefresh, setAutoRefresh] = useState(true)

  const completedSyncs = syncStatus.filter(sync => sync.status === 'completed').length
  const syncingCount = syncStatus.filter(sync => sync.status === 'syncing').length
  const errorCount = syncStatus.filter(sync => sync.status === 'error').length
  const totalRecords = syncStatus.reduce((sum, sync) => sum + sync.recordsProcessed, 0)
  const avgSuccessRate = syncStatus.reduce((sum, sync) => sum + sync.successRate, 0) / syncStatus.length

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Sync Status</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor data synchronization across all integrated systems
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {autoRefresh ? 'Pause Auto-refresh' : 'Enable Auto-refresh'}
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Syncs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedSyncs}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {Math.round((completedSyncs / syncStatus.length) * 100)}% success rate
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Currently Syncing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{syncingCount}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Active processes
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRecords.toLocaleString()}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Processed today
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Error Count</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{errorCount}</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Require attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {syncStatus.map((sync) => {
          const IconComponent = sync.icon
          const StatusIcon = getStatusIcon(sync.status)
          
          return (
            <Card key={sync.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <IconComponent className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">{sync.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sync.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(sync.status)}>
                      {sync.status.charAt(0).toUpperCase() + sync.status.slice(1)}
                    </Badge>
                    <StatusIcon className={`h-4 w-4 ${
                      sync.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                      sync.status === 'syncing' ? 'text-blue-600 dark:text-blue-400' :
                      sync.status === 'error' ? 'text-red-600 dark:text-red-400' :
                      sync.status === 'paused' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {sync.status === 'syncing' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Sync Progress</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{sync.progress}%</span>
                    </div>
                    <Progress value={sync.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Records Processed</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {sync.recordsProcessed.toLocaleString()}
                      {sync.totalRecords > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400"> / {sync.totalRecords.toLocaleString()}</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className={`text-lg font-semibold ${
                      sync.successRate >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
                      sync.successRate >= 85 ? 'text-blue-600 dark:text-blue-400' :
                      sync.successRate >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {sync.successRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sync Duration</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{sync.syncDuration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Data Size</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{sync.dataSize}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Last Sync</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(sync.lastSync).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Next Sync</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {sync.nextSync === 'Paused' ? 'Paused' : new Date(sync.nextSync).toLocaleString()}
                    </span>
                  </div>
                  {sync.errorCount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Errors</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{sync.errorCount}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {sync.status === 'syncing' ? 'Syncing in progress...' :
                       sync.status === 'completed' ? 'Last sync completed successfully' :
                       sync.status === 'error' ? 'Sync failed - check logs' :
                       sync.status === 'paused' ? 'Sync paused by user' :
                       'Sync scheduled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    {sync.status === 'paused' ? (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </Button>
                    ) : sync.status === 'error' ? (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Sync Summary */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Sync Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Successful Syncs</h3>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                {completedSyncs} integrations completed successfully with an average success rate of {avgSuccessRate.toFixed(1)}%.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Active Syncs</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {syncingCount} integrations are currently syncing data. Monitor progress above.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="font-medium text-red-900 dark:text-red-100">Issues Detected</h3>
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
