// InventoryItem Entity - Domain Layer
export class InventoryItem {
  constructor(id, name, category, quantity, unit, location, addedBy, updatedBy, filePath, createdAt, updatedAt) {
    this.id = id
    this.name = name
    this.category = category
    this.quantity = quantity
    this.unit = unit
    this.location = location
    this.addedBy = addedBy
    this.updatedBy = updatedBy
    this.filePath = filePath
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  isLowStock(threshold = 10) {
    return this.quantity <= threshold
  }

  updateQuantity(newQuantity) {
    this.quantity = newQuantity
    this.updatedAt = new Date()
  }
}
