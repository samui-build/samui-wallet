import type { Database } from './database'

import { dbAccountFindMany } from './db-account-find-many'

export async function dbAccountCreateDetermineOrder(db: Database): Promise<number> {
  const accounts = await dbAccountFindMany(db)
  if (accounts.length === 0) {
    return 0
  }
  return Math.max(...accounts.map((account) => account.order)) + 1
}
