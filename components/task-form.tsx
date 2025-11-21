"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiCall } from "@/lib/api"

interface TaskFormProps {
  onTaskCreated: () => void
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setLoading(true)

    try {
      await apiCall("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      })

      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueDate("")
      setTags("")
      onTaskCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title *
        </label>
        <Input
          id="title"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input border-border"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-input border-border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-input border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags (comma-separated)
        </label>
        <Input
          id="tags"
          type="text"
          placeholder="work, urgent, review"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="bg-input border-border"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? "Creating..." : "Create Task"}
      </Button>
    </form>
  )
}
