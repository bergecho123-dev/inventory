import { RegisterUserUseCase } from "../../../application/use-cases/RegisterUserUseCase.js"
import { LoginUserUseCase } from "../../../application/use-cases/LoginUserUseCase.js"

export class AuthController {
  constructor(userRepository) {
    this.registerUseCase = new RegisterUserUseCase(userRepository)
    this.loginUseCase = new LoginUserUseCase(userRepository)
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" })
      }

      const user = await this.registerUseCase.execute(name, email, password)
      res.status(201).json({ message: "User registered successfully", user })
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" })
      }

      const result = await this.loginUseCase.execute(email, password)
      res.status(200).json(result)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }
}
