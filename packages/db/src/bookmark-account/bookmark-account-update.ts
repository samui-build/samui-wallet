import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'
import { parseStrict } from '../parse-strict.ts'
import type { BookmarkAccountUpdateInput } from './bookmark-account-update-input.ts'
import { bookmarkAccountUpdateSchema } from './bookmark-account-update-schema.ts'

export async function bookmarkAccountUpdate(
  db: Database,
  id: string,
  input: BookmarkAccountUpdateInput,
): Promise<number> {
  const parsedInput = parseStrict(bookmarkAccountUpdateSchema.parse(input))
  return db.transaction('rw', db.bookmarkAccounts, async () => {
    const result = await Result.tryPromise(() =>
      db.bookmarkAccounts.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error updating bookmark account with id ${id}`)
    }
    return result.value
  })
}
