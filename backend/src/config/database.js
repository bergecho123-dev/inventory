import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

// Load environment variables from .env
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env file");
}

const sql = neon(connectionString);

export default sql;
