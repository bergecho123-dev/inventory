export class LendingController {
  constructor(lendingRepository) {
    this.lendingRepository = lendingRepository
  }

  async lend(req, res, next) {
    try {
      const { itemId, borrowerId, quantity = 1 } = req.body
      if (!itemId || !borrowerId) {
        return res.status(400).json({ error: "Missing itemId or borrowerId" })
      }
      const record = await this.lendingRepository.create({
        itemId: Number.parseInt(itemId),
        borrowerId: Number.parseInt(borrowerId),
        quantity: Number.parseInt(quantity),
        lentBy: req.user.id,
      })
      res.status(201).json(record)
    } catch (error) {
      next(error)
    }
  }

  async return(req, res, next) {
    try {
      const { id } = req.params
      const record = await this.lendingRepository.markReturned(Number.parseInt(id))
      if (!record) return res.status(404).json({ error: "Record not found" })
      res.status(200).json(record)
    } catch (error) {
      next(error)
    }
  }

  async list(req, res, next) {
    try {
      const records = await this.lendingRepository.findAll()
      res.status(200).json(records)
    } catch (error) {
      next(error)
    }
  }

  async my(req, res, next) {
    try {
      const records = await this.lendingRepository.findByBorrower(req.user.id)
      res.status(200).json(records)
    } catch (error) {
      next(error)
    }
  }
}
