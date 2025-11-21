import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { JWT_SECRET } from "../middleware/auth.js"

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" })
    }

    const user = new User({ email, password, name })
    await user.save()

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, email: user.email, name: user.name },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, name: user.name },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
