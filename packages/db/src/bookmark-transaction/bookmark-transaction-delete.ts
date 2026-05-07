import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'

export async function bookmarkTransactionDelete(ctx: AppContext, id: string): Promise<void> {
  return ctx.db.transaction('rw', ctx.db.bookmarkTransactions, async () => {
    return tryCatchOrThrow(ctx.db.bookmarkTransactions.delete(id), `Error deleting bookmark transaction with id ${id}`)
  })
}
