"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useShipmentActivity } from "../../hooks/useShipmentData"

interface ActivityTabProps {
  shipmentId?: string
}

export function ActivityTab({ shipmentId }: ActivityTabProps) {
  const { data: auditLogs, loading, error } = useShipmentActivity(shipmentId)

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Loading activity...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        Error: {error.message}
      </div>
    )
  }

  if (auditLogs.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 text-center text-gray-400">
          No activity yet
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {auditLogs.map((log) => (
        <Card key={log.id} className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">
                  {log.action}
                </div>
                {log.user_id && (
                  <div className="text-xs text-gray-400 mb-1">
                    User: {log.user_id.slice(0, 8)}
                  </div>
                )}
                {log.metadata && typeof log.metadata === 'object' && Object.keys(log.metadata).length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {JSON.stringify(log.metadata, null, 2)}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

