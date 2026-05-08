import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { DbContext } from '../db-context.ts'
import { randomId } from '../random-id.ts'
import type { BookmarkAccountCreateInput } from './bookmark-account-create-input.ts'
import { bookmarkAccountCreateSchema } from './bookmark-account-create-schema.ts'

export async function bookmarkAccountCreate(ctx: DbContext, input: BookmarkAccountCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = bookmarkAccountCreateSchema.parse(input)

  return ctx.db.transaction('rw', ctx.db.bookmarkAccounts, async () => {
    return tryCatchOrThrow(
      ctx.db.bookmarkAccounts.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
      `Error creating bookmark account`,
    )
  })
}
