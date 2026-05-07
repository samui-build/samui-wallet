import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import { accountFindMany } from '../account/account-find-many.ts'
import { accountFindUnique } from '../account/account-find-unique.ts'
import type { AppContext } from '../app-context.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function walletDelete(ctx: AppContext, id: string): Promise<void> {
  return ctx.db.transaction('rw', ctx.db.accounts, ctx.db.settings, ctx.db.wallets, async () => {
    const activeAccountId = (await settingFindUnique(ctx, 'activeAccountId'))?.value
    if (!activeAccountId) {
      throw new Error('No active account set.')
    }
    const activeAccount = await accountFindUnique(ctx, activeAccountId)
    if (id === activeAccount?.walletId) {
      throw new Error('You cannot delete the active wallet. Please change wallets and try again.')
    }
    const accounts = await accountFindMany(ctx, { walletId: id })
    await tryCatchOrThrow(
      ctx.db.accounts.bulkDelete(accounts.map((account) => account.id)),
      `Error deleting accounts for wallet with id ${id}`,
    )
    return tryCatchOrThrow(ctx.db.wallets.delete(id), `Error deleting wallet with id ${id}`)
  })
}
