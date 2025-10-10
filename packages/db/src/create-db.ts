import type { DbConfig } from './database'

import { Database } from './database'

export function createDb(config: DbConfig) {
  return new Database(config)
}
