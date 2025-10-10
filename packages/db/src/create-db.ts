import { Database, type DatabaseConfig } from './database'

export function createDb(config: DatabaseConfig) {
  return new Database(config)
}
