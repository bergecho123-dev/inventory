import express from "express"
import cors from "cors"
import { config } from "./config/env.js"
import { UserRepositoryImpl } from "./infrastructure/database/UserRepositoryImpl.js"
import { InventoryRepositoryImpl } from "./infrastructure/database/InventoryRepositoryImpl.js"
import { ActivityLogRepositoryImpl } from "./infrastructure/database/ActivityLogRepositoryImpl.js"
import { createAuthRoutes } from "./interfaces/http/routes/authRoutes.js"
import { createInventoryRoutes } from "./interfaces/http/routes/inventoryRoutes.js"
import { createActivityLogRoutes } from "./interfaces/http/routes/activityLogRoutes.js"
import { createUserRoutes } from "./interfaces/http/routes/userRoutes.js"
import { errorMiddleware } from "./interfaces/http/middlewares/errorMiddleware.js"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize repositories
const userRepository = new UserRepositoryImpl()
const inventoryRepository = new InventoryRepositoryImpl()
const activityLogRepository = new ActivityLogRepositoryImpl()

// Routes
app.use("/api/auth", createAuthRoutes(userRepository))
app.use("/api/inventory", createInventoryRoutes(inventoryRepository))
app.use("/api/activity-logs", createActivityLogRoutes(activityLogRepository))
app.use("/api/users", createUserRoutes(userRepository))

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorMiddleware)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
app.listen(config.port, () => {
  console.log(`[Server] Running on http://localhost:${config.port}`)
})

export default app
