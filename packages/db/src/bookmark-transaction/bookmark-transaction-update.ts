import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { DbContext } from '../db-context.ts'
import { parseStrict } from '../parse-strict.ts'
import type { BookmarkTransactionUpdateInput } from './bookmark-transaction-update-input.ts'
import { bookmarkTransactionUpdateSchema } from './bookmark-transaction-update-schema.ts'

export async function bookmarkTransactionUpdate(
  ctx: DbContext,
  id: string,
  input: BookmarkTransactionUpdateInput,
): Promise<number> {
  const parsedInput = parseStrict(bookmarkTransactionUpdateSchema.parse(input))
  return ctx.db.transaction('rw', ctx.db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(
      ctx.db.bookmarkTransactions.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
      `Error updating bookmark transaction with id ${id}`,
    )
  })
}
