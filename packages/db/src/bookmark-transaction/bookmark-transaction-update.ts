import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { Database } from '../database.ts'
import { parseStrict } from '../parse-strict.ts'
import type { BookmarkTransactionUpdateInput } from './bookmark-transaction-update-input.ts'
import { bookmarkTransactionUpdateSchema } from './bookmark-transaction-update-schema.ts'

export async function bookmarkTransactionUpdate(
  db: Database,
  id: string,
  input: BookmarkTransactionUpdateInput,
): Promise<number> {
  const parsedInput = parseStrict(bookmarkTransactionUpdateSchema.parse(input))
  return db.transaction('rw', db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(
      db.bookmarkTransactions.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
      `Error updating bookmark transaction with id ${id}`,
    )
  })
}
