import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'

export async function bookmarkAccountDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.bookmarkAccounts, async () => {
    const result = await Result.tryPromise(() => db.bookmarkAccounts.delete(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error deleting bookmark account with id ${id}`)
    }
    return result.value
  })
}
