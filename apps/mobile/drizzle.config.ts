import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  out: './src/db/drizzle',
  schema: './src/db/schema.ts',
})
