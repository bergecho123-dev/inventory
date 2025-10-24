import { LogActivityUseCase } from "../../../application/use-cases/LogActivityUseCase.js"

export class ActivityLogController {
  constructor(activityLogRepository) {
    this.useCase = new LogActivityUseCase(activityLogRepository)
  }

  async getAll(req, res, next) {
    try {
      const { limit = 100, offset = 0 } = req.query
      const activities = await this.useCase.getActivityHistory(Number.parseInt(limit), Number.parseInt(offset))
      res.status(200).json(activities)
    } catch (error) {
      next(error)
    }
  }

  async getUserActivity(req, res, next) {
    try {
      const { userId } = req.params
      const activities = await this.useCase.getUserActivity(userId)
      res.status(200).json(activities)
    } catch (error) {
      next(error)
    }
  }
}
