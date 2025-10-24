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

  async updateItem(id, partialItem) {
    return await this.inventoryRepository.update(id, partialItem)
  }

  async deleteItem(id) {
    return await this.inventoryRepository.delete(id)
  }
}
