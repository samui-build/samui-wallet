import { tryCatch } from '@workspace/core/try-catch'
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
  const { data, error } = await tryCatch(
    db.bookmarkAccounts.update(id, {
      ...parsedInput,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating bookmark account with id ${id}`)
  }
  return data
}
