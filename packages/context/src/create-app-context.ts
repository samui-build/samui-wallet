import { createDb } from '@workspace/db/create-db'
import { createDbVault } from '@workspace/db/create-db-vault'
import type { Database } from '@workspace/db/database'
import type { AppContext } from './app-context.ts'

export function createAppContext(db: Database = createDb({ name: 'samui-wallet' })): AppContext {
  return { db, vault: createDbVault({ db }) }
}
