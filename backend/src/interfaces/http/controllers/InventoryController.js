import { GetInventoryUseCase } from "../../../application/use-cases/GetInventoryUseCase.js"
import { CreateInventoryUseCase } from "../../../application/use-cases/CreateInventoryUseCase.js"
import { FileUploadService } from "../../../infrastructure/files/FileUploadService.js"

export class InventoryController {
  constructor(inventoryRepository) {
    this.getUseCase = new GetInventoryUseCase(inventoryRepository)
    this.createUseCase = new CreateInventoryUseCase(inventoryRepository)
    this.fileUploadService = new FileUploadService()
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
      let savedFilePath = null
      if (req.file) {
        const saved = this.fileUploadService.saveFile(req.file)
        savedFilePath = saved.filepath
      }

      const item = await this.createUseCase.execute(
        name,
        category,
        Number.parseInt(quantity),
        unit,
        location,
        req.user.id,
        savedFilePath,
      )

      res.status(201).json(item)
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

  async update(req, res, next) {
    try {
      const { id } = req.params
      const { name, category, quantity, unit, location } = req.body

      const updated = await this.getUseCase.updateItem(id, {
        name,
        category,
        quantity: Number.parseInt(quantity),
        unit,
        location,
        updatedBy: req.user.id,
      })

      if (!updated) {
        return res.status(404).json({ error: "Item not found" })
      }

      res.status(200).json(updated)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      await this.getUseCase.deleteItem(id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
