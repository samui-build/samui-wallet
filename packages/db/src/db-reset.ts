import type { Database } from './database.ts'

import { dbPopulate } from './db-populate.ts'

export async function dbReset(db: Database) {
  await Promise.all(db.tables.map((table) => table.clear()))
  await dbPopulate(db)
}
