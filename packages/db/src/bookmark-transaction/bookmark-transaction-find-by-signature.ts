import type { Signature } from '@solana/kit'
import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { DbContext } from '../db-context.ts'
import type { BookmarkTransaction } from './bookmark-transaction.ts'

export async function bookmarkTransactionFindBySignature(
  ctx: DbContext,
  signature: Signature,
): Promise<null | BookmarkTransaction> {
  return ctx.db.transaction('r', ctx.db.bookmarkTransactions, async () => {
    const data = await tryCatchOrThrow(
      ctx.db.bookmarkTransactions.get({ signature }),
      `Error finding bookmark transaction with signature ${signature}`,
    )
    return data ? data : null
  })
}
