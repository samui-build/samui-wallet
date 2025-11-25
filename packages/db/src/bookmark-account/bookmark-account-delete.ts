import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'

export async function bookmarkAccountDelete(db: Database, id: string): Promise<void> {
  const { data, error } = await tryCatch(db.bookmarkAccounts.delete(id))
  if (error) {
    console.log(error)
    throw new Error(`Error deleting bookmark account with id ${id}`)
  }
  return data
}
