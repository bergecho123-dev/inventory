import sql from "../../config/database.js"

export class ActivityLogRepositoryImpl {
  async create(userId, action, itemId, description) {
    const result = await sql`
      INSERT INTO activity_logs (user_id, action, item_id, description)
      VALUES (${userId}, ${action}, ${itemId}, ${description})
      RETURNING *
    `
    return result[0]
  }

  async findAll(limit = 100, offset = 0) {
    const result = await sql`
      SELECT 
        al.id,
        al.user_id,
        al.action,
        al.item_id,
        al.description,
        al.created_at,
        u.name as user_name,
        ii.name as item_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN inventory_items ii ON al.item_id = ii.id
      ORDER BY al.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return result
  }

  async findByUserId(userId, limit = 50) {
    const result = await sql`
      SELECT * FROM activity_logs 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return result
  }

  async findByItemId(itemId) {
    const result = await sql`
      SELECT * FROM activity_logs 
      WHERE item_id = ${itemId}
      ORDER BY created_at DESC
    `
    return result
  }

  async getActivityStats() {
    const result = await sql`
      SELECT 
        action,
        COUNT(*) as count
      FROM activity_logs
      GROUP BY action
    `
    return result
  }
}
