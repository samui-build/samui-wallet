import type { Address } from '@solana/kit'
import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'
import type { BookmarkAccount } from './bookmark-account.ts'

export async function bookmarkAccountFindByAddress(db: Database, address: Address): Promise<null | BookmarkAccount> {
  return db.transaction('r', db.bookmarkAccounts, async () => {
    const result = await Result.tryPromise(() => db.bookmarkAccounts.get({ address }))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding bookmark account with address ${address}`)
    }
    return result.value ? result.value : null
  })
}
