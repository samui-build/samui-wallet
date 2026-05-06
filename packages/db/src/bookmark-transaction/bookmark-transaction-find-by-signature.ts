import type { Signature } from '@solana/kit'
import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { Database } from '../database.ts'
import type { BookmarkTransaction } from './bookmark-transaction.ts'

export async function bookmarkTransactionFindBySignature(
  db: Database,
  signature: Signature,
): Promise<null | BookmarkTransaction> {
  return db.transaction('r', db.bookmarkTransactions, async () => {
    const data = await tryCatchOrThrow(
      db.bookmarkTransactions.get({ signature }),
      `Error finding bookmark transaction with signature ${signature}`,
    )
    return data ? data : null
  })
}
