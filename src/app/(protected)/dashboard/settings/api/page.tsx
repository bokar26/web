"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Calendar,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react"

// Mock data for API keys
const apiKeys = [
  {
    id: 'key-001',
    name: 'Production API Key',
    description: 'Main API key for production environment',
    key: 'sk-prod-1234567890abcdef1234567890abcdef',
    permissions: ['read', 'write', 'admin'],
    environment: 'production',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastUsed: '2024-01-20T14:22:00Z',
    usageCount: 1247,
    rateLimit: '1000/hour'
  },
  {
    id: 'key-002',
    name: 'Development API Key',
    description: 'API key for development and testing',
    key: 'sk-dev-abcdef1234567890abcdef1234567890',
    permissions: ['read', 'write'],
    environment: 'development',
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    lastUsed: '2024-01-20T11:45:00Z',
    usageCount: 89,
    rateLimit: '100/hour'
  },
  {
    id: 'key-003',
    name: 'Read-Only API Key',
    description: 'Read-only access for reporting and analytics',
    key: 'sk-read-9876543210fedcba9876543210fedcba',
    permissions: ['read'],
    environment: 'production',
    status: 'active',
    createdAt: '2024-01-08T16:20:00Z',
    lastUsed: '2024-01-19T08:30:00Z',
    usageCount: 456,
    rateLimit: '500/hour'
  },
  {
    id: 'key-004',
    name: 'Legacy API Key',
    description: 'Old API key - scheduled for deprecation',
    key: 'sk-legacy-fedcba9876543210fedcba9876543210',
    permissions: ['read', 'write'],
    environment: 'production',
    status: 'deprecated',
    createdAt: '2023-12-01T12:00:00Z',
    lastUsed: '2024-01-18T15:10:00Z',
    usageCount: 23,
    rateLimit: '50/hour'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'deprecated': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'revoked': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getEnvironmentColor = (environment: string) => {
  switch (environment) {
    case 'production': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'staging': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function APIKeysPage() {
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({})
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    description: '',
    environment: 'development',
    permissions: [] as string[]
  })

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 8)
  }

  const activeKeys = apiKeys.filter(key => key.status === 'active').length
  const totalKeys = apiKeys.length
  const deprecatedKeys = apiKeys.filter(key => key.status === 'deprecated').length

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">API Keys</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your API keys and access credentials
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Usage
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Generate New Key
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total API Keys</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalKeys}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <Key className="h-3 w-3 mr-1" />
                  {activeKeys} active
                </p>
              </div>
              <Key className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Keys</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeKeys}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  In use
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deprecated Keys</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{deprecatedKeys}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Need attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,815</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  This month
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{apiKey.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{apiKey.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEnvironmentColor(apiKey.environment)}>
                      {apiKey.environment.charAt(0).toUpperCase() + apiKey.environment.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(apiKey.status)}>
                      {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">API Key</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="h-6 w-6 p-0"
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Permissions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rate Limit</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{apiKey.rateLimit}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Usage Count</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{apiKey.usageCount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Used</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {new Date(apiKey.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Secure • Encrypted • Rate Limited
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                      <Activity className="h-3 w-3 mr-1" />
                      Usage Stats
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Getting Started</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Learn how to authenticate and make your first API request.
              </p>
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                View Documentation
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Rate Limits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Understand API rate limits and how to handle them properly.
              </p>
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                Rate Limit Guide
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">SDKs & Libraries</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download our official SDKs for popular programming languages.
              </p>
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                Download SDKs
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get help with API integration and troubleshooting.
              </p>
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
