import type { Database } from './database'

import { dbPopulate } from './db-populate'

export async function dbReset(db: Database) {
  await Promise.all(db.tables.map((table) => table.clear()))
  await dbPopulate(db)
}
