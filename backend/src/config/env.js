export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "5242880"),
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
}
