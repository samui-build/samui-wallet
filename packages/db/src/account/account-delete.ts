import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { DbContext } from '../db-context.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function accountDelete(ctx: DbContext, id: string): Promise<void> {
  return ctx.db.transaction('rw', ctx.db.accounts, ctx.db.settings, async () => {
    const activeAccountId = (await settingFindUnique(ctx, 'activeAccountId'))?.value
    if (id === activeAccountId) {
      throw new Error('You cannot delete the active account. Please change accounts and try again.')
    }

    return tryCatchOrThrow(ctx.db.accounts.delete(id), `Error deleting account with id ${id}`)
  })
}
