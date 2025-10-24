import express from "express"
import { UserController } from "../controllers/UserController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { roleMiddleware } from "../middlewares/roleMiddleware.js"
import { upload } from "../middlewares/uploadMiddleware.js"

export function createUserRoutes(userRepository) {
  const router = express.Router()
  const controller = new UserController(userRepository)

  router.use(authMiddleware)
  router.get("/", roleMiddleware(["admin", "store_manager"]), (req, res, next) => controller.getAll(req, res, next))
  router.post("/", roleMiddleware(["admin"]), upload.single("avatar"), (req, res, next) => controller.create(req, res, next))

  return router
}
