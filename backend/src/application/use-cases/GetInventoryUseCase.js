export class GetInventoryUseCase {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository
  }

  async execute(filters = {}) {
    return await this.inventoryRepository.findAll(filters)
  }

  async executeById(id) {
    return await this.inventoryRepository.findById(id)
  }

  async executeLowStock(threshold = 10) {
    return await this.inventoryRepository.findLowStockItems(threshold)
  }
}
