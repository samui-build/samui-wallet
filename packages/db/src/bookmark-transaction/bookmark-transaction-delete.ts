import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'

export async function bookmarkTransactionDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.bookmarkTransactions, async () => {
    const result = await Result.tryPromise(() => db.bookmarkTransactions.delete(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error deleting bookmark transaction with id ${id}`)
    }
    return result.value
  })
}
