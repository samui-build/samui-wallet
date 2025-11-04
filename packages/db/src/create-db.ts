import { Database, type DatabaseConfig } from './database.ts'

export function createDb(config: DatabaseConfig) {
  return new Database(config)
}
