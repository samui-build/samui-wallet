import type { DbContext } from '../db-context.ts'
import { settingSetValue } from '../setting/setting-set-value.ts'
import { accountFindUnique } from './account-find-unique.ts'

export async function accountSetActive(ctx: DbContext, id: string) {
  return ctx.db.transaction('rw', ctx.db.wallets, ctx.db.settings, ctx.db.accounts, async () => {
    // get the requested account from the database
    const found = await accountFindUnique(ctx, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Account with id ${id} not found`)
    }
    const accountId = found.id

    await settingSetValue(ctx, 'activeAccountId', accountId)
  })
}
