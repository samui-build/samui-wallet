import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { AppContext } from '../app-context.ts'
import type { BookmarkAccount } from './bookmark-account.ts'
import type { BookmarkAccountFindManyInput } from './bookmark-account-find-many-input.ts'
import { bookmarkAccountFindManySchema } from './bookmark-account-find-many-schema.ts'

export async function bookmarkAccountFindMany(
  ctx: AppContext,
  input: BookmarkAccountFindManyInput,
): Promise<BookmarkAccount[]> {
  const parsedInput = bookmarkAccountFindManySchema.parse(input)
  return ctx.db.transaction('r', ctx.db.bookmarkAccounts, async () => {
    return tryCatchOrThrow(
      ctx.db.bookmarkAccounts
        .orderBy('updatedAt')
        .filter((item) => {
          const matchId = !parsedInput.id || item.id === parsedInput.id
          const matchLabel = !parsedInput.label || (item.label ? item.label.includes(parsedInput.label) : false)
          const matchAddress = !parsedInput.address || item.address === parsedInput.address

          return matchId && matchLabel && matchAddress
        })
        .reverse()
        .toArray(),
      `Error finding bookmark accounts`,
    )
  })
}
