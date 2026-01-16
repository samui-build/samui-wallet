import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import type { BookmarkTransactionCreateInput } from './bookmark-transaction-create-input.ts'
import { bookmarkTransactionCreateSchema } from './bookmark-transaction-create-schema.ts'

export async function bookmarkTransactionCreate(db: Database, input: BookmarkTransactionCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = bookmarkTransactionCreateSchema.parse(input)

  return db.transaction('rw', db.bookmarkTransactions, async () => {
    const result = await Result.tryPromise(() =>
      db.bookmarkTransactions.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error creating bookmark transaction`)
    }

    return result.value
  })
}
