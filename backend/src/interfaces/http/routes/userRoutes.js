import express from "express"
import { UserController } from "../controllers/UserController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { roleMiddleware } from "../middlewares/roleMiddleware.js"

export function createUserRoutes(userRepository) {
  const router = express.Router()
  const controller = new UserController(userRepository)

  router.use(authMiddleware)
  router.get("/", roleMiddleware(["admin"]), (req, res, next) => controller.getAll(req, res, next))
  router.post("/", roleMiddleware(["admin"]), (req, res, next) => controller.create(req, res, next))

  return router
}
