import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { AppContext } from '../app-context.ts'
import { parseStrict } from '../parse-strict.ts'
import type { BookmarkAccountUpdateInput } from './bookmark-account-update-input.ts'
import { bookmarkAccountUpdateSchema } from './bookmark-account-update-schema.ts'

export async function bookmarkAccountUpdate(
  ctx: AppContext,
  id: string,
  input: BookmarkAccountUpdateInput,
): Promise<number> {
  const parsedInput = parseStrict(bookmarkAccountUpdateSchema.parse(input))
  return ctx.db.transaction('rw', ctx.db.bookmarkAccounts, async () => {
    return tryCatchOrThrow(
      ctx.db.bookmarkAccounts.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
      `Error updating bookmark account with id ${id}`,
    )
  })
}
