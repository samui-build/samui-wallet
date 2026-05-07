import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import { randomId } from '../random-id.ts'
import type { BookmarkTransactionCreateInput } from './bookmark-transaction-create-input.ts'
import { bookmarkTransactionCreateSchema } from './bookmark-transaction-create-schema.ts'

export async function bookmarkTransactionCreate(
  ctx: AppContext,
  input: BookmarkTransactionCreateInput,
): Promise<string> {
  const now = new Date()
  const parsedInput = bookmarkTransactionCreateSchema.parse(input)

  return ctx.db.transaction('rw', ctx.db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(
      ctx.db.bookmarkTransactions.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
      `Error creating bookmark transaction`,
    )
  })
}
