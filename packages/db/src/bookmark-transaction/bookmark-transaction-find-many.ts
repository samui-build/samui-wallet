import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { DbContext } from '../db-context.ts'
import type { BookmarkTransaction } from './bookmark-transaction.ts'
import type { BookmarkTransactionFindManyInput } from './bookmark-transaction-find-many-input.ts'
import { bookmarkTransactionFindManySchema } from './bookmark-transaction-find-many-schema.ts'

export async function bookmarkTransactionFindMany(
  ctx: DbContext,
  input: BookmarkTransactionFindManyInput,
): Promise<BookmarkTransaction[]> {
  const parsedInput = bookmarkTransactionFindManySchema.parse(input)
  return ctx.db.transaction('r', ctx.db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(
      ctx.db.bookmarkTransactions
        .orderBy('updatedAt')
        .filter((item) => {
          const matchId = !parsedInput.id || item.id === parsedInput.id
          const matchLabel = !parsedInput.label || (item.label ? item.label.includes(parsedInput.label) : false)
          const matchSignature = !parsedInput.signature || item.signature === parsedInput.signature

          return matchId && matchLabel && matchSignature
        })
        .reverse()
        .toArray(),
      `Error finding bookmark transactions`,
    )
  })
}
