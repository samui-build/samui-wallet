import type { Database } from './database.js'

import { dbPopulate } from './db-populate.js'

export async function dbReset(db: Database) {
  await Promise.all(db.tables.map((table) => table.clear()))
  await dbPopulate(db)
}
