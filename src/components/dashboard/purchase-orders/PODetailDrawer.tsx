"use client"

import React from "react"
import { PurchaseOrder } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { TimelineItem } from "@/components/dashboard/atoms/TimelineItem"
import { 
  X, 
  Download, 
  MessageSquare, 
  Calendar,
  MapPin,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

interface PODetailDrawerProps {
  order: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PODetailDrawer: React.FC<PODetailDrawerProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'ordered': return 'bg-blue-500/20 text-blue-300';
      case 'confirmed': return 'bg-purple-500/20 text-purple-300';
      case 'shipped': return 'bg-cyan-500/20 text-cyan-300';
      case 'delivered': return 'bg-emerald-500/20 text-emerald-300';
      case 'delayed': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getSLAStatusColor = (slaStatus: PurchaseOrder['slaStatus']) => {
    switch (slaStatus) {
      case 'on-track': return 'bg-emerald-500/20 text-emerald-300';
      case 'at-risk': return 'bg-amber-500/20 text-amber-300';
      case 'breached': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{order.id}</h2>
            <p className="text-gray-600 dark:text-white">{order.supplier.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="dashboard-card p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-white">Status</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </Card>
                
                <Card className="dashboard-card p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-white">SLA Status</p>
                      <Badge className={getSLAStatusColor(order.slaStatus)}>
                        {order.slaStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="dashboard-card p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-white">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">${order.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Progress */}
              <Card className="dashboard-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-white">Overall Progress</span>
                    <span className="text-gray-600 dark:text-white">{order.progress}%</span>
                  </div>
                  <Progress value={order.progress} className="h-3" />
                </div>
              </Card>

              {/* Timeline */}
              <Card className="dashboard-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Timeline</h3>
                <div className="space-y-4">
                  {order.timeline?.map((item, index) => (
                    <TimelineItem
                      key={index}
                      icon={item.status === 'completed' ? '✓' : item.status === 'in-progress' ? '⏳' : '○'}
                      text={`${item.stage}${item.notes ? ': ' + item.notes : ''}`}
                      timestamp={item.date}
                      type="info"
                    />
                  )) ?? <p className="text-gray-600 dark:text-white text-sm">No timeline data available</p>}
                </div>
              </Card>

              {/* Line Items */}
              <Card className="dashboard-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Line Items</h3>
                <div className="space-y-3">
                  {order.lineItems?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.sku}</p>
                        <p className="text-sm text-gray-600 dark:text-white">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 dark:text-white">Qty: {item.quantity}</p>
                        <p className="text-sm text-gray-600 dark:text-white">${item.unitPrice}/unit</p>
                        <p className="font-semibold text-gray-900 dark:text-white">${(item.quantity * item.unitPrice).toLocaleString()}</p>
                      </div>
                    </div>
                  )) ?? <p className="text-gray-600 dark:text-white text-sm">No line items available</p>}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Details */}
              <Card className="dashboard-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-white">Order Date</p>
                      <p className="text-gray-900 dark:text-white">{order.orderDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-600 dark:text-white" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-white">ETA</p>
                      <p className="text-gray-900 dark:text-white">{order.eta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-600 dark:text-white" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-white">Region</p>
                      <p className="text-gray-900 dark:text-white">{order.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-gray-600 dark:text-white" />
                    <div>
                       <p className="text-sm text-gray-600 dark:text-white">Warehouse</p>
                       <p className="text-gray-900 dark:text-white">{order.warehouse || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Supplier Info */}
              <Card className="dashboard-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supplier Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white">Company</p>
                    <p className="text-gray-900 dark:text-white">{order.supplier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white">Email</p>
                    <p className="text-gray-900 dark:text-white">{order.supplier.contact.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white">Phone</p>
                    <p className="text-gray-900 dark:text-white">{order.supplier.contact.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-white">Performance Score</p>
                    <p className="text-gray-900 dark:text-white">{order.supplier.performance?.overall || 'N/A'}/100</p>
                  </div>
                </div>
              </Card>

              {/* Comments */}
              <Card className="dashboard-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
                <div className="space-y-3">
                  {order.comments?.map((comment, index) => (
                    <div key={index} className="p-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">{comment.author}</p>
                        <p className="text-sm text-gray-600 dark:text-white">{new Date(comment.timestamp).toLocaleDateString()}</p>
                      </div>
                      <p className="text-gray-600 dark:text-white text-sm">{comment.message}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {comment.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
