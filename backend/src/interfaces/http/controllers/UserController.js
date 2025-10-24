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
}
