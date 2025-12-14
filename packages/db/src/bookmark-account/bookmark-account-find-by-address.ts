import type { Address } from '@solana/kit'
import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import type { BookmarkAccount } from './bookmark-account.ts'

export async function bookmarkAccountFindByAddress(db: Database, address: Address): Promise<null | BookmarkAccount> {
  return db.transaction('r', db.bookmarkAccounts, async () => {
    const { data, error } = await tryCatch(db.bookmarkAccounts.get({ address }))
    if (error) {
      console.log(error)
      throw new Error(`Error finding bookmark account with address ${address}`)
    }
    return data ? data : null
  })
}
