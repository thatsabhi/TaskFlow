# TaskFlow API Documentation

## Overview
TaskFlow is a REST API for managing tasks with JWT-based authentication. All requests (except authentication) require a valid JWT token.

**Base URL:** `http://localhost:5000`

---

## Authentication

### Register
**Endpoint:** `POST /api/auth/register`

Create a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
\`\`\`

**Error Response (400 Bad Request):**
\`\`\`json
{
  "error": "Email already in use"
}
\`\`\`

---

### Login
**Endpoint:** `POST /api/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
\`\`\`

**Error Response (401 Unauthorized):**
\`\`\`json
{
  "error": "Invalid credentials"
}
\`\`\`

---

## Tasks

All task endpoints require authentication. Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <TOKEN>
\`\`\`

### Get All Tasks
**Endpoint:** `GET /api/tasks`

Retrieve all tasks for the authenticated user.

**Response (200 OK):**
\`\`\`json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project report",
    "description": "Finish the quarterly project report with all metrics",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2025-12-31T00:00:00.000Z",
    "tags": ["work", "urgent"],
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-11-21T10:30:00.000Z",
    "updatedAt": "2025-11-21T10:30:00.000Z"
  }
]
\`\`\`

---

### Create Task
**Endpoint:** `POST /api/tasks`

Create a new task.

**Request Body:**
\`\`\`json
{
  "title": "Complete project report",
  "description": "Finish the quarterly project report with all metrics",
  "priority": "high",
  "dueDate": "2025-12-31",
  "tags": ["work", "urgent"]
}
\`\`\`

**Fields:**
- `title` (required, string): Task title
- `description` (optional, string): Detailed description
- `priority` (optional, string): "low", "medium", or "high" (default: "medium")
- `dueDate` (optional, string): ISO 8601 date format
- `tags` (optional, array): Array of tag strings

**Response (201 Created):**
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Complete project report",
  "description": "Finish the quarterly project report with all metrics",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-31T00:00:00.000Z",
  "tags": ["work", "urgent"],
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2025-11-21T10:30:00.000Z",
  "updatedAt": "2025-11-21T10:30:00.000Z"
}
\`\`\`

---

### Update Task
**Endpoint:** `PUT /api/tasks/:id`

Update an existing task. Supports partial updates.

**URL Parameters:**
- `id` (required, string): Task ID (MongoDB ObjectId)

**Request Body (any of the following):**
\`\`\`json
{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "medium",
  "description": "Updated description",
  "dueDate": "2025-12-25",
  "tags": ["updated", "tag"]
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "medium",
  "dueDate": "2025-12-25T00:00:00.000Z",
  "tags": ["updated", "tag"],
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2025-11-21T10:30:00.000Z",
  "updatedAt": "2025-11-21T11:45:00.000Z"
}
\`\`\`

**Error Response (404 Not Found):**
\`\`\`json
{
  "error": "Task not found"
}
\`\`\`

---

### Delete Task
**Endpoint:** `DELETE /api/tasks/:id`

Delete a task permanently.

**URL Parameters:**
- `id` (required, string): Task ID (MongoDB ObjectId)

**Response (200 OK):**
\`\`\`json
{
  "message": "Task deleted successfully"
}
\`\`\`

**Error Response (404 Not Found):**
\`\`\`json
{
  "error": "Task not found"
}
\`\`\`

---

## Health Check

### Server Status
**Endpoint:** `GET /api/health`

Check if the server is running. No authentication required.

**Response (200 OK):**
\`\`\`json
{
  "status": "OK",
  "message": "Server is running"
}
\`\`\`

---

## Data Models

### User
\`\`\`
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed with bcrypt),
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

### Task
\`\`\`
{
  "_id": ObjectId,
  "title": String (required),
  "description": String,
  "status": String ("todo", "in_progress", "completed"),
  "priority": String ("low", "medium", "high"),
  "dueDate": Date,
  "tags": [String],
  "userId": ObjectId (reference to User),
  "createdAt": Date,
  "updatedAt": Date
}
\`\`\`

---

## Error Handling

All error responses follow this format:

\`\`\`json
{
  "error": "Error message describing what went wrong"
}
\`\`\`

**Common Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <TOKEN>
\`\`\`

Tokens are valid for **7 days**. After expiration, users must log in again to receive a new token.

---

## Environment Variables

Create a `.env` file in the backend directory:

\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_key_here
\`\`\`

---

## Quick Start with Postman

1. **Import the Collection:**
   - Open Postman
   - Click "Import" → "Upload Files"
   - Select `Postman_Collection.json`

2. **Set Environment Variables:**
   - Click "Environments" in the top-right
   - Edit the default environment and set:
     - `BASE_URL`: `http://localhost:5000`
     - `TOKEN`: (leave empty, will be populated after login)
     - `TASK_ID`: (leave empty, will use from task creation)

3. **Test the Flow:**
   - Register a new account (POST /api/auth/register)
   - Copy the token from the response
   - Paste it into the TOKEN variable
   - Create, read, update, and delete tasks

---

## Rate Limiting

Currently, there is no rate limiting. Consider implementing rate limiting in production using packages like `express-rate-limit`.

## CORS

CORS is enabled for all origins. In production, restrict to your frontend domain:

\`\`\`javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
