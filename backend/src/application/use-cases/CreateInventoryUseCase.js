import { InventoryItem } from "../../domain/entities/InventoryItem.js"

export class CreateInventoryUseCase {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository
  }

  async execute(name, category, quantity, unit, location, addedBy, filePath = null, serialNumber = null) {
    if (!name || !category || quantity < 0 || !unit) {
      throw new Error("Invalid inventory item data")
    }

    const item = new InventoryItem(
      null,
      name,
      category,
      quantity,
      unit,
      location,
      addedBy,
      addedBy,
      filePath,
      new Date(),
      new Date(),
    )

    // Attach serialNumber as extra property used by repository
    item.serialNumber = serialNumber
    return await this.inventoryRepository.create(item)
  }
}
