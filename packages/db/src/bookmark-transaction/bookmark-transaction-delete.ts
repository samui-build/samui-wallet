import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { DbContext } from '../db-context.ts'

export async function bookmarkTransactionDelete(ctx: DbContext, id: string): Promise<void> {
  return ctx.db.transaction('rw', ctx.db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(ctx.db.bookmarkTransactions.delete(id), `Error deleting bookmark transaction with id ${id}`)
  })
}
