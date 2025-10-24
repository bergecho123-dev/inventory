import sql from "../../config/database.js"

export class LendingRepositoryImpl {
  async create({ itemId, borrowerId, quantity, lentBy }) {
    const result = await sql`
      INSERT INTO lendings (item_id, borrower_id, quantity, lent_by)
      VALUES (${itemId}, ${borrowerId}, ${quantity}, ${lentBy})
      RETURNING *
    `
    return result[0]
  }

  async markReturned(id) {
    const result = await sql`UPDATE lendings SET returned_at = NOW() WHERE id = ${id} RETURNING *`
    return result[0]
  }

  async findAll() {
    return await sql`SELECT * FROM lendings ORDER BY lent_at DESC`
  }

  async findByBorrower(borrowerId) {
    return await sql`SELECT * FROM lendings WHERE borrower_id = ${borrowerId} ORDER BY lent_at DESC`
  }
}
