import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "../../config/env.js"

export class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(email, password) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("User account is inactive")
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry },
    )

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}
