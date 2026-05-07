import type { AppContext } from './app-context.ts'
import { createDb } from './create-db.ts'
import type { Database } from './database.ts'

export function createAppContext(db: Database = createDb({ name: 'samui-wallet' })): AppContext {
  return { db }
}
