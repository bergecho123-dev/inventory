export class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async getAll(req, res, next) {
    try {
      const users = await this.userRepository.findAll()
      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const { name, email, password, role } = req.body
      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields" })
      }
      const registerUC = new (await import("../../application/use-cases/RegisterUserUseCase.js")).RegisterUserUseCase(
        this.userRepository,
      )
      const user = await registerUC.execute(name, email, password, role, req.body.profile_image || null)
      res.status(201).json(user)
    } catch (error) {
      next(error)
    }
  }
}
