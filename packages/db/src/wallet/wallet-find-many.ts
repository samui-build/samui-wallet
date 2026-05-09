import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { DbContext } from '../db-context.ts'
import type { Wallet } from './wallet.ts'
import type { WalletFindManyInput } from './wallet-find-many-input.ts'

import { walletFindManySchema } from './wallet-find-many-schema.ts'
import { walletSanitizer } from './wallet-sanitizer.ts'

export async function walletFindMany(ctx: DbContext, input: WalletFindManyInput = {}): Promise<Wallet[]> {
  const parsedInput = walletFindManySchema.parse(input)
  return ctx.db.transaction('r', ctx.db.wallets, ctx.db.accounts, async () => {
    const [dataWallets, dataAccounts] = await Promise.all([
      tryCatchOrThrow(
        ctx.db.wallets
          .orderBy('order')
          .filter((item) => {
            const matchId = !parsedInput.id || item.id === parsedInput.id
            const matchName = !parsedInput.name || item.name.includes(parsedInput.name)

            return matchId && matchName
          })
          .raw()
          .toArray(),
        `Error finding wallets`,
      ),
      tryCatchOrThrow(ctx.db.accounts.orderBy('order').toArray(), `Error finding accounts`),
    ])
    return [
      ...dataWallets.map((wallet) => {
        const sanitizedWallet = walletSanitizer(wallet)
        return {
          ...sanitizedWallet,
          accounts: dataAccounts.filter((account) => account.walletId === wallet.id),
        }
      }),
    ]
  })
}
