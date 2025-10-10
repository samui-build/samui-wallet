import { tryCatch } from '@workspace/core/try-catch'

import type { Db } from './db'

export async function dbAccountDelete(db: Db, id: string): Promise<void> {
  const { data, error } = await tryCatch(db.accounts.delete(id))
  if (error) {
    console.log(error)
    throw new Error(`Error deleting account with id ${id}`)
  }
  return data
}
