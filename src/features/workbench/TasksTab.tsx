"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTask } from "@/server/actions/workbench/tasks.create"
import { updateTask } from "@/server/actions/workbench/tasks.update"
import { CheckSquare } from "lucide-react"

export function TasksTab() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please provide a task title");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createTask({
        title,
        description: description || undefined,
      });

      if (result.ok) {
        toast.success("Task created successfully");
        setTitle("");
        setDescription("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('[TasksTab] Create task error:', error);
      toast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Create Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <Label htmlFor="taskTitle" className="text-gray-900 dark:text-white">Title</Label>
              <Input
                id="taskTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="taskDescription" className="text-gray-900 dark:text-white">Description (optional)</Label>
              <Input
                id="taskDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isCreating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isCreating ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

