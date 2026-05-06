import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
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
    return tryCatchOrThrow(
      db.bookmarkAccounts.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
      `Error updating bookmark account with id ${id}`,
    )
  })
}
