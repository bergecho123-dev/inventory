import express from "express"
import { ActivityLogController } from "../controllers/ActivityLogController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

export function createActivityLogRoutes(activityLogRepository) {
  const router = express.Router()
  const controller = new ActivityLogController(activityLogRepository)

  router.use(authMiddleware)

  router.get("/", (req, res, next) => controller.getAll(req, res, next))
  router.get("/user/:userId", (req, res, next) => controller.getUserActivity(req, res, next))

  return router
}
