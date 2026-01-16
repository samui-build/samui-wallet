import { Result } from '@workspace/core/result'
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
    const result = await Result.tryPromise(() =>
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
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding bookmark transactions`)
    }
    return result.value
  })
}
