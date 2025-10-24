import { GetInventoryUseCase } from "../../../application/use-cases/GetInventoryUseCase.js"
import { CreateInventoryUseCase } from "../../../application/use-cases/CreateInventoryUseCase.js"

export class InventoryController {
  constructor(inventoryRepository) {
    this.getUseCase = new GetInventoryUseCase(inventoryRepository)
    this.createUseCase = new CreateInventoryUseCase(inventoryRepository)
  }

  async getAll(req, res, next) {
    try {
      const { category, search } = req.query
      const items = await this.getUseCase.execute({ category, search })
      res.status(200).json(items)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const item = await this.getUseCase.executeById(id)

      if (!item) {
        return res.status(404).json({ error: "Item not found" })
      }

      res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const { name, category, quantity, unit, location } = req.body
      const filePath = req.file ? req.file.path : null

      const item = await this.createUseCase.execute(name, category, quantity, unit, location, req.user.id, filePath)

      res.status(201).json({ message: "Item created successfully", item })
    } catch (error) {
      next(error)
    }
  }

  async getLowStock(req, res, next) {
    try {
      const { threshold = 10 } = req.query
      const items = await this.getUseCase.executeLowStock(Number.parseInt(threshold))
      res.status(200).json(items)
    } catch (error) {
      next(error)
    }
  }
}
