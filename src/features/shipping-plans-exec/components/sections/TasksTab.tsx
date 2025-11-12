"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useShipmentTasks } from "../../hooks/useShipmentData"
import { createTaskAction } from "../../actions/createTask"
import { TOAST_MESSAGES } from "../../constants"

interface TasksTabProps {
  shipmentId?: string
}

export function TasksTab({ shipmentId }: TasksTabProps) {
  const { user } = useUser()
  const { data: tasks, loading, error } = useShipmentTasks(shipmentId)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
  })

  const handleCreateTask = async () => {
    if (!shipmentId || !user?.id) {
      toast.error("Please sign in to create tasks")
      return
    }

    if (!taskForm.title.trim()) {
      toast.error("Task title is required")
      return
    }

    setIsCreating(true)
    try {
      await createTaskAction({
        shipmentId,
        task: {
          title: taskForm.title,
          description: taskForm.description || undefined,
          status: 'open',
          dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined,
        },
        ownerUserId: user.id,
      })

      toast.success(TOAST_MESSAGES.TASK_CREATED)
      setIsCreateModalOpen(false)
      setTaskForm({ title: '', description: '', dueDate: '' })
      // Data will refresh via hook
    } catch (error) {
      console.error('[TasksTab] Failed to create task:', error)
      toast.error(error instanceof Error ? error.message : TOAST_MESSAGES.TASK_ERROR)
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Loading tasks...
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

  return (
    <div className="space-y-4">
      {/* Create Task Button */}
      <div className="flex justify-end">
        <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <SheetTrigger asChild>
            <Button size="sm" disabled={!shipmentId}>
              Create Task
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-gray-800 border-gray-700">
            <SheetHeader>
              <SheetTitle className="text-white">Create Task</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="task-title" className="text-white">Title *</Label>
                <Input
                  id="task-title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="task-description" className="text-white">Description</Label>
                <Textarea
                  id="task-description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="task-due-date" className="text-white">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTask}
                  disabled={isCreating || !taskForm.title.trim()}
                >
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center text-gray-400">
            No tasks yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-gray-400 mb-2">
                        {task.description}
                      </div>
                    )}
                  </div>
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
                {task.due_date && (
                  <div className="text-xs text-gray-500">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

