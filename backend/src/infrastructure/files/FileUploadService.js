import fs from "fs"
import path from "path"
import { config } from "../../config/env.js"

export class FileUploadService {
  constructor() {
    this.uploadDir = config.uploadDir
    this.ensureUploadDir()
  }

  ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  validateFile(file) {
    if (!file) {
      throw new Error("No file provided")
    }

    if (file.size > config.maxFileSize) {
      throw new Error(`File size exceeds maximum limit of ${config.maxFileSize} bytes`)
    }

    const allowedMimes = ["application/pdf", "image/jpeg", "image/png", "text/plain"]
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error("File type not allowed")
    }

    return true
  }

  saveFile(file) {
    this.validateFile(file)

    const timestamp = Date.now()
    const filename = `${timestamp}-${file.originalname}`
    const filepath = path.join(this.uploadDir, filename)

    fs.writeFileSync(filepath, file.buffer)

    return {
      filename,
      filepath,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }
  }

  deleteFile(filename) {
    const filepath = path.join(this.uploadDir, filename)
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      return true
    }
    return false
  }

  getFile(filename) {
    const filepath = path.join(this.uploadDir, filename)
    if (fs.existsSync(filepath)) {
      return fs.readFileSync(filepath)
    }
    return null
  }
}
