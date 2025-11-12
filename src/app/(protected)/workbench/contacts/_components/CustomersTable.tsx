"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Edit, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - replace with actual Supabase query from customers table
const mockCustomers = [
  {
    id: "CUST-001",
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    status: "active",
    totalOrders: 45,
    totalValue: 125000,
  },
  {
    id: "CUST-002",
    name: "Tech Solutions",
    email: "info@techsolutions.com",
    phone: "+1 (555) 987-6543",
    country: "Canada",
    status: "active",
    totalOrders: 32,
    totalValue: 89000,
  },
]

interface CustomersTableProps {
  onViewDetails?: (customerId: string) => void
  onEdit?: (customerId: string) => void
}

export function CustomersTable({ onViewDetails, onEdit }: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers] = useState(mockCustomers)

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-white">Name</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Contact</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Country</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Total Orders</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Total Value</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    <div>{customer.email}</div>
                    <div className="text-sm">{customer.phone}</div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {customer.country}
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="text-right text-gray-900 dark:text-white">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 dark:text-white">
                    ${customer.totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails?.(customer.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(customer.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-600 dark:text-gray-400">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

