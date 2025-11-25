import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import type { BookmarkAccount } from './bookmark-account.ts'

export async function bookmarkAccountFindUnique(db: Database, id: string): Promise<null | BookmarkAccount> {
  const { data, error } = await tryCatch(db.bookmarkAccounts.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding bookmark account with id ${id}`)
  }
  return data ? data : null
}
