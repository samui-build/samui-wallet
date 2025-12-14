import type { Signature } from '@solana/kit'
import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import type { BookmarkTransaction } from './bookmark-transaction.ts'

export async function bookmarkTransactionFindBySignature(
  db: Database,
  signature: Signature,
): Promise<null | BookmarkTransaction> {
  return db.transaction('r', db.bookmarkTransactions, async () => {
    const { data, error } = await tryCatch(db.bookmarkTransactions.get({ signature }))
    if (error) {
      console.log(error)
      throw new Error(`Error finding bookmark transaction with signature ${signature}`)
    }
    return data ? data : null
  })
}
