import bcrypt from "bcryptjs"
import { User } from "../../domain/entities/User.js"

export class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(name, email, password, role = "employee") {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User(null, name, email, passwordHash, role, true, new Date(), new Date())

    // Save to repository
    const savedUser = await this.userRepository.create(user)

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    }
  }
}
