"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiCall } from "@/lib/api"
import type { Task } from "./task-list"

interface TaskItemProps {
  task: Task
  onUpdated: () => void
  onDeleted: () => void
}

export function TaskItem({ task, onUpdated, onDeleted }: TaskItemProps) {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const statusColors: Record<string, string> = {
    todo: "bg-muted text-muted-foreground",
    "in-progress": "bg-accent/20 text-accent-foreground",
    completed: "bg-primary/20 text-primary-foreground",
  }

  const priorityColors: Record<string, string> = {
    low: "bg-blue-500/20 text-blue-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-red-500/20 text-red-400",
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true)
      await apiCall(`/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      })
      onUpdated()
    } catch (err) {
      console.error("Failed to update task status:", err)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      setDeleting(true)
      await apiCall(`/tasks/${task._id}`, {
        method: "DELETE",
      })
      onDeleted()
    } catch (err) {
      console.error("Failed to delete task:", err)
    } finally {
      setDeleting(false)
    }
  }

  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "completed"

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-foreground break-words">{task.title}</h3>
              {task.description && <p className="text-sm text-muted-foreground break-words">{task.description}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={statusColors[task.status]}>
              {task.status === "in-progress"
                ? "In Progress"
                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            <Badge className={priorityColors[task.priority]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            {isOverdue && <Badge className="bg-destructive/20 text-destructive">Overdue</Badge>}
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-border">
                {tag}
              </Badge>
            ))}
          </div>

          {dueDate && (
            <p className={`text-xs ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
              Due: {dueDate.toLocaleDateString()}
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            {task.status !== "completed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange(task.status === "todo" ? "in-progress" : "completed")}
                disabled={updating}
                className="border-border hover:bg-primary hover:text-primary-foreground hover:border-primary text-xs"
              >
                {task.status === "todo"
                  ? updating
                    ? "Updating..."
                    : "Start"
                  : updating
                    ? "Completing..."
                    : "Complete"}
              </Button>
            )}
            {task.status === "completed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("todo")}
                disabled={updating}
                className="border-border hover:bg-muted text-xs"
              >
                {updating ? "Reopening..." : "Reopen"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
