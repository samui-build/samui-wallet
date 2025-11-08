import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { Account } from './entity/account.ts'

export async function dbAccountFindUnique(db: Database, id: string): Promise<null | Account> {
  const { data, error } = await tryCatch(db.accounts.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding account with id ${id}`)
  }
  return data ? data : null
}
