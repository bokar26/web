'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface UpdateTaskParams {
  taskId: string
  title?: string
  description?: string
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string
}

export interface UpdateTaskResult {
  taskId: string
}

/**
 * Update task
 */
export async function updateTask(
  params: UpdateTaskParams
): Promise<ActionResult<UpdateTaskResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Get current state
    const { data: existing } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.taskId)
      .eq('owner_user_id', userId)
      .single()

    if (!existing) {
      return { ok: false, error: 'Task not found' }
    }

    // Update task
    const updateData: any = {}
    if (params.title !== undefined) updateData.title = params.title
    if (params.description !== undefined) updateData.description = params.description
    if (params.status !== undefined) updateData.status = params.status
    if (params.priority !== undefined) updateData.priority = params.priority
    if (params.assignedTo !== undefined) updateData.assigned_to = params.assignedTo

    const { data: updated, error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', params.taskId)
      .eq('owner_user_id', userId)
      .select()
      .single()

    if (updateError || !updated) {
      return { ok: false, error: updateError?.message || 'Failed to update task' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'task',
      entityId: params.taskId,
      action: 'update',
      beforeState: existing,
      afterState: updateData,
    })

    return {
      ok: true,
      data: {
        taskId: params.taskId,
      },
    }
  } catch (error: any) {
    console.error('[tasks.update] Error:', error)
    return { ok: false, error: error.message || 'Failed to update task' }
  }
}

