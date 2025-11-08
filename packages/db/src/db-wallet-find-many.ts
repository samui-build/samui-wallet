import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { WalletInputFindMany } from './dto/wallet-input-find-many.ts'
import type { Wallet } from './entity/wallet.ts'

import { walletSchemaFindMany } from './schema/wallet-schema-find-many.ts'

export async function dbWalletFindMany(db: Database, input: WalletInputFindMany = {}): Promise<Wallet[]> {
  const parsedInput = walletSchemaFindMany.parse(input)
  return db.transaction('r', db.wallets, db.accounts, async () => {
    const [{ data: dataWallets, error: walletsError }, { data: dataAccounts, error: errorAccounts }] =
      await Promise.all([
        tryCatch(
          db.wallets
            .orderBy('order')
            .filter((item) => {
              const matchId = !parsedInput.id || item.id === parsedInput.id
              const matchName = !parsedInput.name || item.name.includes(parsedInput.name)

              return matchId && matchName
            })
            .toArray(),
        ),
        tryCatch(db.accounts.orderBy('order').toArray()),
      ])

    if (walletsError) {
      console.log(walletsError)
      throw new Error(`Error finding wallets`)
    }
    if (errorAccounts) {
      console.log(errorAccounts)
      throw new Error(`Error finding accounts`)
    }
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
