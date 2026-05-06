import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { Database } from '../database.ts'
import type { BookmarkTransaction } from './bookmark-transaction.ts'
import type { BookmarkTransactionFindManyInput } from './bookmark-transaction-find-many-input.ts'
import { bookmarkTransactionFindManySchema } from './bookmark-transaction-find-many-schema.ts'

export async function bookmarkTransactionFindMany(
  db: Database,
  input: BookmarkTransactionFindManyInput,
): Promise<BookmarkTransaction[]> {
  const parsedInput = bookmarkTransactionFindManySchema.parse(input)
  return db.transaction('r', db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(
      db.bookmarkTransactions
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
