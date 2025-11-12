'use server'

import { auth } from '@clerk/nextjs/server'
import {
  CreateTaskRequest,
  CreateTaskResponse,
} from '../types'
import { getShipment } from '../data/shipments'
import { createTask } from '../data/tasks'
import { log } from '../data/audit'

/**
 * Create a task linked to shipment/exception
 */
export async function createTaskAction(
  request: CreateTaskRequest
): Promise<CreateTaskResponse> {
  const { shipmentId, task, ownerUserId } = request

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

    // Create task
    const createdTask = await createTask(shipmentId, {
      exception_id: task.exceptionId || null,
      title: task.title,
      description: task.description || null,
      status: task.status,
      assigned_to: task.assignedTo || null,
      due_date: task.dueDate || null,
    })

    // Log audit
    await log(ownerUserId, 'task', createdTask.id, 'created', undefined, {
      shipment_id: shipmentId,
      title: task.title,
      status: task.status,
    })

    return {
      task: createdTask,
    }
  } catch (error) {
    console.error('Failed to create task:', error)
    throw error instanceof Error ? error : new Error('Failed to create task')
  }
}

