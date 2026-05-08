import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { DbContext } from '../db-context.ts'

export async function bookmarkAccountDelete(ctx: DbContext, id: string): Promise<void> {
  return ctx.db.transaction('rw', ctx.db.bookmarkAccounts, async () => {
    return tryCatchOrThrow(ctx.db.bookmarkAccounts.delete(id), `Error deleting bookmark account with id ${id}`)
  })
}
