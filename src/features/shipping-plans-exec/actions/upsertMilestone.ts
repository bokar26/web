'use server'

import { auth } from '@clerk/nextjs/server'
import {
  UpsertMilestoneRequest,
  UpsertMilestoneResponse,
} from '../types'
import { getShipment } from '../data/shipments'
import { upsertMilestone } from '../data/milestones'
import { createException } from '../data/exceptions'
import { evaluateShipmentExceptions } from '../rules/exceptions'
import { log } from '../data/audit'

/**
 * Create or update milestone and evaluate exceptions
 */
export async function upsertMilestoneAction(
  request: UpsertMilestoneRequest
): Promise<UpsertMilestoneResponse> {
  const { shipmentId, milestone, ownerUserId } = request

  // Verify authentication
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  if (ownerUserId !== userId) {
    throw new Error('User ID mismatch')
  }

  try {
    // Get shipment
    const shipment = await getShipment(ownerUserId, shipmentId)
    if (!shipment) {
      throw new Error('Shipment not found')
    }

    // Upsert milestone
    const savedMilestone = await upsertMilestone(
      shipmentId,
      milestone.id,
      {
        milestone_type: milestone.milestoneType,
        planned_date: milestone.plannedDate,
        actual_date: milestone.actualDate || null,
        status: milestone.status,
        notes: milestone.notes || null,
      }
    )

    // Recalculate ETA deltas (if actual date is set)
    if (milestone.actualDate) {
      // Reload shipment with updated milestone
      const updatedShipment = await getShipment(ownerUserId, shipmentId)
      if (updatedShipment) {
        // Evaluate exceptions
        const exceptions = evaluateShipmentExceptions(updatedShipment)

        // Create exceptions that don't already exist
        const createdExceptions = []
        for (const exception of exceptions) {
          // Check if similar exception already exists
          // For simplicity, create all - in production, check for duplicates
          const created = await createException(shipmentId, {
            exception_type: exception.exception_type,
            severity: exception.severity,
            message: exception.message,
            threshold_value: exception.threshold_value,
            actual_value: exception.actual_value,
          })
          createdExceptions.push(created)

          // Log audit
          await log(ownerUserId, 'exception', created.id, 'created', undefined, {
            shipment_id: shipmentId,
            exception_type: exception.exception_type,
            severity: exception.severity,
          })
        }

        // Log milestone update
        await log(ownerUserId, 'milestone', savedMilestone.id, milestone.id ? 'updated' : 'created', 
          milestone.id ? { status: milestone.status } : undefined,
          {
            milestone_type: milestone.milestoneType,
            status: milestone.status,
          }
        )

        return {
          milestone: savedMilestone,
          exceptions: createdExceptions,
        }
      }
    }

    // Log milestone update
    await log(ownerUserId, 'milestone', savedMilestone.id, milestone.id ? 'updated' : 'created',
      milestone.id ? { status: milestone.status } : undefined,
      {
        milestone_type: milestone.milestoneType,
        status: milestone.status,
      }
    )

    return {
      milestone: savedMilestone,
      exceptions: [],
    }
  } catch (error) {
    console.error('Failed to upsert milestone:', error)
    throw error instanceof Error ? error : new Error('Failed to upsert milestone')
  }
}

