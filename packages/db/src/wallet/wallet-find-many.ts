import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { Wallet } from './wallet.ts'
import type { WalletFindManyInput } from './wallet-find-many-input.ts'

import { walletFindManySchema } from './wallet-find-many-schema.ts'
import { walletSanitizer } from './wallet-sanitizer.ts'

export async function walletFindMany(db: Database, input: WalletFindManyInput = {}): Promise<Wallet[]> {
  const parsedInput = walletFindManySchema.parse(input)
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
          ...walletSanitizer(wallet),
          accounts: [...dataAccounts.filter((account) => account.walletId === wallet.id)],
        }
      }),
    ]
  })
}
