import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'

export async function bookmarkAccountDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.bookmarkAccounts, async () => {
    return tryCatchOrThrow(db.bookmarkAccounts.delete(id), `Error deleting bookmark account with id ${id}`)
  })
}
