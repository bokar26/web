"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, CheckCircle, Clock } from "lucide-react"

// Mock data - replace with actual Supabase query
const mockQuotes = [
  {
    id: "Q-001",
    shipmentId: "SHIP-001",
    provider: "Maersk",
    rate: 12500,
    currency: "USD",
    validUntil: "2024-01-25",
    status: "quoted",
  },
  {
    id: "Q-002",
    shipmentId: "SHIP-001",
    provider: "CMA CGM",
    rate: 11800,
    currency: "USD",
    validUntil: "2024-01-24",
    status: "quoted",
  },
]

export function RateQuotePanel() {
  const [quotes] = useState(mockQuotes)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      quoted: "default",
      accepted: "default",
      expired: "secondary",
      rejected: "destructive",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Rate Quotes</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Compare quotes from freight forwarders and carriers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-white">Provider</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Rate</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Valid Until</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length > 0 ? (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {quote.provider}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {quote.currency} {quote.rate.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {quote.validUntil}
                  </TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="text-right">
                    {quote.status === "quoted" && (
                      <Button size="sm" variant="outline">
                        Accept
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-600 dark:text-gray-400">
                  No quotes available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

