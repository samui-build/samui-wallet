import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import { decryptWithVaultKey } from '@workspace/vault/encrypted-value'
import type { DbContext } from '../db-context.ts'

export async function walletReadMnemonic(ctx: DbContext, id: string): Promise<string> {
  const wallet = await ctx.db.transaction('r', ctx.db.wallets, async () => {
    const wallet = await tryCatchOrThrow(
      ctx.db.wallets.where('id').equals(id).raw().first(),
      `Error finding wallet with id ${id}`,
    )
    if (!wallet) {
      throw new Error(`Wallet with id ${id} not found`)
    }
    return wallet
  })

  return await decryptWithVaultKey({
    encrypted: wallet.mnemonic,
    key: await ctx.vault.requireWalletKey({ walletId: id }),
  })
}
