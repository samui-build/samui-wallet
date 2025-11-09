import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { WalletInputFindMany } from './dto/wallet-input-find-many.ts'
import type { Wallet } from './entity/wallet.ts'

import { walletSchemaFindMany } from './schema/wallet-schema-find-many.ts'

export async function dbWalletFindMany(db: Database, input: WalletInputFindMany = {}): Promise<Wallet[]> {
  const parsedInput = walletSchemaFindMany.parse(input)
  return db.transaction('r', db.wallets, db.accounts, async () => {
    const effectWallets = Effect.tryPromise({
      catch: (error) => new Error(`Error finding wallets: ${String(error)}`),
      try: () =>
        db.wallets
          .orderBy('order')
          .filter((item) => {
            const matchId = !parsedInput.id || item.id === parsedInput.id
            const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
            return matchId && matchName
          })
          .toArray(),
    })

    const effectAccounts = Effect.tryPromise({
      catch: (error) => new Error(`Error finding accounts: ${String(error)}`),
      try: () => db.accounts.orderBy('order').toArray(),
    })

    const [dataWallets, dataAccounts] = await Effect.runPromise(Effect.all([effectWallets, effectAccounts]))

    return [
      ...dataWallets.map((wallet) => {
        return {
          ...wallet,
          accounts: [...dataAccounts.filter((account) => account.walletId === wallet.id)],
        }
      }),
    ]
  })
}
