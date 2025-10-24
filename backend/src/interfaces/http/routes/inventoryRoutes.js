import express from "express"
import { InventoryController } from "../controllers/InventoryController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { roleMiddleware } from "../middlewares/roleMiddleware.js"
import { upload } from "../middlewares/uploadMiddleware.js"

export function createInventoryRoutes(inventoryRepository) {
  const router = express.Router()
  const inventoryController = new InventoryController(inventoryRepository)

  // All inventory routes require authentication
  router.use(authMiddleware)

  // Get low stock items (define before dynamic routes)
  router.get("/low-stock/items", (req, res, next) => inventoryController.getLowStock(req, res, next))

  // Get all items (all authenticated users)
  router.get("/", (req, res, next) => inventoryController.getAll(req, res, next))

  // Get single item
  router.get("/:id", (req, res, next) => inventoryController.getById(req, res, next))

  // Create item (admin and store manager only)
  router.post("/", roleMiddleware(["store_manager"]), upload.single("file"), (req, res, next) =>
    inventoryController.create(req, res, next),
  )

  // Update item (admin and store manager only)
  router.put("/:id", roleMiddleware(["store_manager"]), upload.single("file"), (req, res, next) =>
    inventoryController.update(req, res, next),
  )

  // Delete item (admin and store manager only)
  router.delete("/:id", roleMiddleware(["store_manager"]), (req, res, next) =>
    inventoryController.delete(req, res, next),
  )

  return router
}
