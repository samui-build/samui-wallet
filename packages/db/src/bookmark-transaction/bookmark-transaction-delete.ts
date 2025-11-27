import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'

export async function bookmarkTransactionDelete(db: Database, id: string): Promise<void> {
  const { data, error } = await tryCatch(db.bookmarkTransactions.delete(id))
  if (error) {
    console.log(error)
    throw new Error(`Error deleting bookmark transaction with id ${id}`)
  }
  return data
}
