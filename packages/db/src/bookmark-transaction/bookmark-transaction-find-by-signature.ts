import type { Signature } from '@solana/kit'
import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'
import type { BookmarkTransaction } from './bookmark-transaction.ts'

export async function bookmarkTransactionFindBySignature(
  db: Database,
  signature: Signature,
): Promise<null | BookmarkTransaction> {
  return db.transaction('r', db.bookmarkTransactions, async () => {
    const result = await Result.tryPromise(() => db.bookmarkTransactions.get({ signature }))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding bookmark transaction with signature ${signature}`)
    }
    return result.value ? result.value : null
  })
}
