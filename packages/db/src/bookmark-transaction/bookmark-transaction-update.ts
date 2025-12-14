import { tryCatch } from '@workspace/core/try-catch'
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
    const { data, error } = await tryCatch(
      db.bookmarkTransactions.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
    )
    if (error) {
      console.log(error)
      throw new Error(`Error updating bookmark transaction with id ${id}`)
    }
    return data
  })
}
