export class LogActivityUseCase {
  constructor(activityLogRepository) {
    this.activityLogRepository = activityLogRepository
  }

  async execute(userId, action, itemId = null, description = "") {
    return await this.activityLogRepository.create(userId, action, itemId, description)
  }

  async getActivityHistory(limit = 100, offset = 0) {
    return await this.activityLogRepository.findAll(limit, offset)
  }

  async getUserActivity(userId, limit = 50) {
    return await this.activityLogRepository.findByUserId(userId, limit)
  }
}
