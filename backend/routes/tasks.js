import express from "express"
import Task from "../models/Task.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get all tasks for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create task
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body

    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      tags: tags || [],
      userId: req.userId,
    })

    await task.save()
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update task
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    Object.assign(task, req.body)
    await task.save()
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId })

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
