'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { ActionResult } from './types'
import { logAuditEvent } from './audit'

export interface CreateTaskParams {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  linkedExceptionId?: string
  linkedRunId?: string
  assignedTo?: string
}

export interface CreateTaskResult {
  taskId: string
}

/**
 * Create task linked to exceptions/runs
 */
export async function createTask(
  params: CreateTaskParams
): Promise<ActionResult<CreateTaskResult>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { ok: false, error: 'User not authenticated' }
    }

    const supabase = createServerClient()
    if (!supabase) {
      return { ok: false, error: 'Database connection failed' }
    }

    // Create task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        owner_user_id: userId,
        title: params.title,
        description: params.description || null,
        priority: params.priority || 'medium',
        status: 'open',
        linked_exception_id: params.linkedExceptionId || null,
        linked_run_id: params.linkedRunId || null,
        assigned_to: params.assignedTo || null,
      })
      .select()
      .single()

    if (taskError || !task) {
      return { ok: false, error: taskError?.message || 'Failed to create task' }
    }

    // Log audit event
    await logAuditEvent({
      entityType: 'task',
      entityId: task.id,
      action: 'create',
      afterState: { title: params.title, priority: params.priority },
    })

    return {
      ok: true,
      data: {
        taskId: task.id,
      },
    }
  } catch (error: any) {
    console.error('[tasks.create] Error:', error)
    return { ok: false, error: error.message || 'Failed to create task' }
  }
}

