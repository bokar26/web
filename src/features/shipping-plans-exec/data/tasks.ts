/**
 * Tasks data service
 * CRUD operations for tasks
 */

import { createServerClient } from '@/lib/supabase/server'
import {
  SupabaseTask,
  Task,
  TaskStatus,
} from '../types'

/**
 * Create a task
 */
export async function createTask(
  shipmentId: string,
  data: Omit<SupabaseTask, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>
): Promise<SupabaseTask> {
  const supabase = createServerClient()

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      ...data,
      shipment_id: shipmentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create task:', error)
    throw new Error(`Failed to create task: ${error.message}`)
  }

  return task as SupabaseTask
}

/**
 * Get task by ID
 */
export async function getTask(taskId: string): Promise<SupabaseTask | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SupabaseTask
}

/**
 * List tasks for shipment
 */
export async function listTasksForShipment(
  shipmentId: string,
  options?: {
    status?: TaskStatus
    exceptionId?: string
  }
): Promise<SupabaseTask[]> {
  const supabase = createServerClient()

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.exceptionId) {
    query = query.eq('exception_id', options.exceptionId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to list tasks:', error)
    throw new Error(`Failed to list tasks: ${error.message}`)
  }

  return (data || []) as SupabaseTask[]
}

/**
 * Update task
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Omit<SupabaseTask, 'id' | 'shipment_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseTask> {
  const supabase = createServerClient()

  // If status is being set to completed, set completed_at
  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  if (updates.status === 'completed' && !updates.completed_at) {
    updateData.completed_at = new Date().toISOString()
  } else if (updates.status !== 'completed') {
    updateData.completed_at = null
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update task:', error)
    throw new Error(`Failed to update task: ${error.message}`)
  }

  return data as SupabaseTask
}

