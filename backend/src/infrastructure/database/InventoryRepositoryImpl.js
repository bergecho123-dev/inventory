import sql from "../../config/database.js"
import { InventoryItem } from "../../domain/entities/InventoryItem.js"
import { InventoryRepository } from "../../domain/repositories/InventoryRepository.js"

export class InventoryRepositoryImpl extends InventoryRepository {
  async findById(id) {
    const result = await sql`SELECT * FROM inventory_items WHERE id = ${id}`
    return result.length > 0 ? this._mapToItem(result[0]) : null
  }

  async create(item) {
    const result = await sql`
      INSERT INTO inventory_items (name, category, quantity, unit, location, added_by, updated_by, file_path)
      VALUES (${item.name}, ${item.category}, ${item.quantity}, ${item.unit}, ${item.location}, ${item.addedBy}, ${item.updatedBy}, ${item.filePath})
      RETURNING *
    `
    return this._mapToItem(result[0])
  }

  async update(id, item) {
    const result = await sql`
      UPDATE inventory_items 
      SET name = ${item.name}, category = ${item.category}, quantity = ${item.quantity}, 
          unit = ${item.unit}, location = ${item.location}, updated_by = ${item.updatedBy}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0 ? this._mapToItem(result[0]) : null
  }

  async delete(id) {
    await sql`DELETE FROM inventory_items WHERE id = ${id}`
  }

  async findAll(filters = {}) {
    let query = sql`SELECT * FROM inventory_items WHERE 1=1`

    if (filters.category) {
      query = sql`SELECT * FROM inventory_items WHERE category = ${filters.category}`
    }
    if (filters.search) {
      query = sql`SELECT * FROM inventory_items WHERE name ILIKE ${"%" + filters.search + "%"}`
    }

    const result = await query
    return result.map((row) => this._mapToItem(row))
  }

  async findByCategory(category) {
    const result = await sql`SELECT * FROM inventory_items WHERE category = ${category}`
    return result.map((row) => this._mapToItem(row))
  }

  async findLowStockItems(threshold = 10) {
    const result = await sql`SELECT * FROM inventory_items WHERE quantity <= ${threshold}`
    return result.map((row) => this._mapToItem(row))
  }

  _mapToItem(row) {
    return new InventoryItem(
      row.id,
      row.name,
      row.category,
      row.quantity,
      row.unit,
      row.location,
      row.added_by,
      row.updated_by,
      row.file_path,
      row.created_at,
      row.updated_at,
    )
  }
}
