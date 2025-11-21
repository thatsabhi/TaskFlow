"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiCall } from "@/lib/api"
import { TaskForm } from "./task-form"
import { TaskItem } from "./task-item"

export interface Task {
  _id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "completed">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await apiCall("/tasks")
      setTasks(data)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = async () => {
    setShowForm(false)
    await fetchTasks()
  }

  const handleTaskUpdated = async () => {
    await fetchTasks()
  }

  const handleTaskDeleted = async () => {
    await fetchTasks()
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">To Do</p>
              <p className="text-3xl font-bold text-accent">{stats.todo}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold text-accent">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-primary">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Manage your tasks and track progress</CardDescription>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {showForm ? "Cancel" : "+ New Task"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {showForm && (
            <div className="border-b border-border pb-6">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border flex-1"
              />
              <div className="flex gap-2">
                {(["all", "todo", "in-progress", "completed"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className={
                      filter === status ? "bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                    }
                  >
                    {status === "all"
                      ? "All"
                      : status === "in-progress"
                        ? "In Progress"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {tasks.length === 0
                  ? "No tasks yet. Create one to get started!"
                  : "No tasks match your search or filter."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskItem key={task._id} task={task} onUpdated={handleTaskUpdated} onDeleted={handleTaskDeleted} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
