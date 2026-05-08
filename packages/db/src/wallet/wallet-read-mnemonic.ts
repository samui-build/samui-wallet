import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { DbContext } from '../db-context.ts'

export function walletReadMnemonic(ctx: DbContext, id: string) {
  return ctx.db.transaction('r', ctx.db.wallets, async () => {
    const wallet = await tryCatchOrThrow(
      ctx.db.wallets.where('id').equals(id).raw().first(),
      `Error finding wallet with id ${id}`,
    )
    if (!wallet) {
      throw new Error(`Wallet with id ${id} not found`)
    }
    // TODO: Decrypt wallet.secret here and use it to decrypt wallet.mnemonic
    return wallet.mnemonic
  })
}
