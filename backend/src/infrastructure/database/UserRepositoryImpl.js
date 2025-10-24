import sql from "../../config/database.js"
import { User } from "../../domain/entities/User.js"
import { UserRepository } from "../../domain/repositories/UserRepository.js"

export class UserRepositoryImpl extends UserRepository {
  async findById(id) {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`
    return result.length > 0 ? this._mapToUser(result[0]) : null
  }

  async findByEmail(email) {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return result.length > 0 ? this._mapToUser(result[0]) : null
  }

  async create(user) {
    const result = await sql`
      INSERT INTO users (name, email, password_hash, role, is_active)
      VALUES (${user.name}, ${user.email}, ${user.passwordHash}, ${user.role}, ${user.isActive})
      RETURNING *
    `
    return this._mapToUser(result[0])
  }

  async update(id, user) {
    const result = await sql`
      UPDATE users 
      SET name = ${user.name}, email = ${user.email}, role = ${user.role}, is_active = ${user.isActive}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0 ? this._mapToUser(result[0]) : null
  }

  async delete(id) {
    await sql`DELETE FROM users WHERE id = ${id}`
  }

  async findAll() {
    const result = await sql`SELECT * FROM users ORDER BY created_at DESC`
    return result.map((row) => this._mapToUser(row))
  }

  _mapToUser(row) {
    return new User(
      row.id,
      row.name,
      row.email,
      row.password_hash,
      row.role,
      row.is_active,
      row.created_at,
      row.updated_at,
    )
  }
}
