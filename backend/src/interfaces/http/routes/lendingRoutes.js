import express from "express"
import { LendingController } from "../controllers/LendingController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { roleMiddleware } from "../middlewares/roleMiddleware.js"
import { LendingRepositoryImpl } from "../../infrastructure/database/LendingRepositoryImpl.js"

export function createLendingRoutes() {
  const router = express.Router()
  const lendingRepository = new LendingRepositoryImpl()
  const controller = new LendingController(lendingRepository)

  router.use(authMiddleware)

  // Store manager lends/returns
  router.post("/lend", roleMiddleware(["store_manager"]), (req, res, next) => controller.lend(req, res, next))
  router.post("/return/:id", roleMiddleware(["store_manager"]), (req, res, next) => controller.return(req, res, next))

  // Lists
  router.get("/", roleMiddleware(["admin", "store_manager"]), (req, res, next) => controller.list(req, res, next))
  router.get("/my", (req, res, next) => controller.my(req, res, next))

  return router
}
