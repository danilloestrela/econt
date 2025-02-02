import "dotenv/config"
import { z } from "zod"
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3002),
  HOST: z.string().default("localhost"),
  API_URL: z
    .string()
    .url()
    .default(`http://${process.env.HOST}:${process.env.PORT}`),
  DATABASE_HOST: z.string().default("localhost"),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USER: z.string().default("admin"),
  DATABASE_PASSWORD: z.string().default("admin"),
  DATABASE_DB: z.string().default("econt_database"),
  JWT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error("❌ Invalid enviroment variables", _env.error.format())
  throw new Error("Invalid enviroment variables.")
}

export const env = _env.data
