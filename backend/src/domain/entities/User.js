// User Entity - Domain Layer
export class User {
  constructor(id, name, email, passwordHash, role, isActive, createdAt, updatedAt) {
    this.id = id
    this.name = name
    this.email = email
    this.passwordHash = passwordHash
    this.role = role
    this.isActive = isActive
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  isAdmin() {
    return this.role === "admin"
  }

  isStoreManager() {
    return this.role === "store_manager"
  }

  isEmployee() {
    return this.role === "employee"
  }

  canManageInventory() {
    return this.isAdmin() || this.isStoreManager()
  }
}
