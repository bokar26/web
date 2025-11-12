'use server'

import { auth } from '@clerk/nextjs/server'
import { listQuotesForShipment, getBookingForShipment } from '../data/quotes'
import { listDocumentsForShipment } from '../data/documents'
import { listTasksForShipment } from '../data/tasks'
import { listCostsForShipment } from '../data/costs'
import { listExceptionsForShipment } from '../data/exceptions'
import { listAuditLogs } from '../data/audit'

/**
 * Get execution data for a shipment (quotes, bookings, docs, tasks, costs, exceptions, audit logs)
 * Scoped by owner_user_id
 */
export async function getExecutionData(shipmentId: string | undefined) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  if (!shipmentId) {
    // Return empty data if no shipment ID
    return {
      quotes: [],
      booking: null,
      documents: [],
      tasks: [],
      costs: [],
      exceptions: [],
      auditLogs: [],
    }
  }

  try {
    // Fetch all data in parallel
    const [quotes, booking, documents, tasks, costs, exceptions, auditLogs] = await Promise.all([
      listQuotesForShipment(shipmentId).catch(() => []),
      getBookingForShipment(shipmentId).catch(() => null),
      listDocumentsForShipment(shipmentId).catch(() => []),
      listTasksForShipment(shipmentId).catch(() => []),
      listCostsForShipment(shipmentId).catch(() => []),
      listExceptionsForShipment(shipmentId, { resolved: false }).catch(() => []),
      listAuditLogs(userId, { entityId: shipmentId, limit: 50 }).catch(() => []),
    ])

    return {
      quotes,
      booking,
      documents,
      tasks,
      costs,
      exceptions,
      auditLogs,
    }
  } catch (error) {
    console.error('[shipping/getExecutionData] Error:', error)
    // Return empty data on error to prevent UI crashes
    return {
      quotes: [],
      booking: null,
      documents: [],
      tasks: [],
      costs: [],
      exceptions: [],
      auditLogs: [],
    }
  }
}

