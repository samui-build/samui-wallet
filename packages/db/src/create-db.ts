import { Database, type DatabaseConfig } from './database.js'

export function createDb(config: DatabaseConfig) {
  return new Database(config)
}
