import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import type { BookmarkAccount } from './bookmark-account.ts'
import type { BookmarkAccountFindManyInput } from './bookmark-account-find-many-input.ts'
import { bookmarkAccountFindManySchema } from './bookmark-account-find-many-schema.ts'

export async function bookmarkAccountFindMany(
  db: Database,
  input: BookmarkAccountFindManyInput,
): Promise<BookmarkAccount[]> {
  const parsedInput = bookmarkAccountFindManySchema.parse(input)
  const { data, error } = await tryCatch(
    db.bookmarkAccounts
      .orderBy('address')
      .filter((item) => {
        const matchId = !parsedInput.id || item.id === parsedInput.id
        const matchLabel = !parsedInput.label || (item.label ? item.label.includes(parsedInput.label) : false)
        const matchAddress = !parsedInput.address || item.address === parsedInput.address

        return matchId && matchLabel && matchAddress
      })
      .toArray(),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error finding bookmark accounts`)
  }
  return data
}
