import type { Database } from './database.ts'

import { populate } from './populate.ts'

export async function reset(db: Database) {
  await Promise.all(db.tables.map((table) => table.clear()))
  await populate(db)
}
