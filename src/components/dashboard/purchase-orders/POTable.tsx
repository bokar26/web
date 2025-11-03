"use client"

import React from "react"
import { PurchaseOrder } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Download as DownloadIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface POTableProps {
  orders: PurchaseOrder[];
  onOrderClick: (order: PurchaseOrder) => void;
  onExport: () => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const getStatusColor = (status: PurchaseOrder['status']) => {
  switch (status) {
    case 'ordered': return 'bg-blue-500/20 text-blue-300';
    case 'confirmed': return 'bg-purple-500/20 text-purple-300';
    case 'shipped': return 'bg-cyan-500/20 text-cyan-300';
    case 'delivered': return 'bg-emerald-500/20 text-emerald-300';
    case 'delayed': return 'bg-red-500/20 text-red-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
}

const getSLAStatusColor = (slaStatus: PurchaseOrder['slaStatus']) => {
  switch (slaStatus) {
    case 'on-track': return 'bg-emerald-500/20 text-emerald-300';
    case 'at-risk': return 'bg-amber-500/20 text-amber-300';
    case 'breached': return 'bg-red-500/20 text-red-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
}

export const POTable: React.FC<POTableProps> = ({
  orders,
  onOrderClick,
  onExport,
  sortBy,
  sortDirection,
  onSort
}) => {
  const renderSortIcon = (column: string) => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
    }
    return null;
  };

  return (
    <Card className="dashboard-card p-0 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Purchase Order Tracker</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white cursor-pointer" onClick={() => onSort('id')}>
                PO # {renderSortIcon('id')}
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white cursor-pointer" onClick={() => onSort('supplier')}>
                Supplier {renderSortIcon('supplier')}
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white cursor-pointer" onClick={() => onSort('orderDate')}>
                Order Date {renderSortIcon('orderDate')}
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white cursor-pointer" onClick={() => onSort('eta')}>
                ETA / Actual Delivery {renderSortIcon('eta')}
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Status</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">SLA Status</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white text-right cursor-pointer" onClick={() => onSort('amount')}>
                Amount ($) {renderSortIcon('amount')}
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Progress</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-white text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
                onClick={() => onOrderClick(order)}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                  <div className="text-sm text-gray-600 dark:text-white">{order.region}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">{order.supplier.name}</div>
                  <div className="text-sm text-gray-600 dark:text-white">{order.supplier.contact.email}</div>
                </td>
                <td className="py-4 px-4 text-gray-600 dark:text-white">{order.orderDate}</td>
                <td className="py-4 px-4">
                  <div className="text-gray-600 dark:text-white">{order.eta}</div>
                  {order.actualDelivery && (
                    <div className="text-sm text-gray-600 dark:text-white">Actual: {order.actualDelivery}</div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge className={getSLAStatusColor(order.slaStatus)}>
                    {order.slaStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-right text-gray-600 dark:text-white">
                  ${order.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Progress value={order.progress} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 dark:text-white w-12">{order.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800">
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Order
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Comment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => e.stopPropagation()}
                        className="text-red-400 focus:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
