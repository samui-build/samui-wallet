import type { Address } from '@solana/kit'
import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { Database } from '../database.ts'
import type { BookmarkAccount } from './bookmark-account.ts'

export async function bookmarkAccountFindByAddress(db: Database, address: Address): Promise<null | BookmarkAccount> {
  return db.transaction('r', db.bookmarkAccounts, async () => {
    const data = await tryCatchOrThrow(
      db.bookmarkAccounts.get({ address }),
      `Error finding bookmark account with address ${address}`,
    )
    return data ? data : null
  })
}
