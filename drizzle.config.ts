import type { Config } from "drizzle-kit";
import dotenv from 'dotenv'

dotenv.config({
    path: '.env.local',
});

export default {
  schema: "./server/schemas/*.ts",
  out: "./drizzle",
  driver: 'mysql2',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? ""
  }
} satisfies Config;
