import dotenv from "dotenv"
import { Pool } from "pg"

// Load environment variables from .env
dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env file")
}

const pgPool = new Pool({
  connectionString,
  // you can add ssl or other pg options here if required
  // ssl: { rejectUnauthorized: false } // if needed for hosted DBs
})

// A tagged-template helper that converts template literals to parameterized queries
// Usage in repo: const result = await sql`SELECT * FROM table WHERE id = ${id}`
export default async function sql(strings, ...values) {
  // If called as a tagged template (strings is an array-like object)
  if (Array.isArray(strings)) {
    let text = ""
    const params = []

    for (let i = 0; i < strings.length; i++) {
      text += strings[i]
      if (i < values.length) {
        params.push(values[i])
        text += `$${params.length}`
      }
    }

    const res = await pgPool.query(text, params)
    return res.rows
  }

  // Fallback: if someone calls sql("text", [params]) or sql(queryText, ...params)
  if (typeof strings === "string") {
    const queryText = strings
    const queryParams = Array.isArray(values[0]) ? values[0] : values
    const res = await pgPool.query(queryText, queryParams)
    return res.rows
  }

  throw new Error("Invalid usage of sql()")
}

// Export the raw pool for advanced usage (transactions, client acquisition, etc.)
export { pgPool as pool }
