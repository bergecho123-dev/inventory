import express from "express"
import { AuthController } from "../controllers/AuthController.js"

export function createAuthRoutes(userRepository) {
  const router = express.Router()
  const authController = new AuthController(userRepository)

  router.post("/register", (req, res, next) => authController.register(req, res, next))
  router.post("/login", (req, res, next) => authController.login(req, res, next))

  return router
}
