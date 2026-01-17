import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import type { BookmarkAccountCreateInput } from './bookmark-account-create-input.ts'
import { bookmarkAccountCreateSchema } from './bookmark-account-create-schema.ts'

export async function bookmarkAccountCreate(db: Database, input: BookmarkAccountCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = bookmarkAccountCreateSchema.parse(input)

  return db.transaction('rw', db.bookmarkAccounts, async () => {
    const result = await Result.tryPromise(() =>
      db.bookmarkAccounts.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error creating bookmark account`)
    }

    return result.value
  })
}
