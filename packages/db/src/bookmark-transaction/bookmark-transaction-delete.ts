import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'

export async function bookmarkTransactionDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(db.bookmarkTransactions.delete(id), `Error deleting bookmark transaction with id ${id}`)
  })
}
