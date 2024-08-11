import type { Config } from 'drizzle-kit'

export default {
  schema: './database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config
