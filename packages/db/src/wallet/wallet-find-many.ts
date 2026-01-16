import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import type { Wallet } from './wallet.ts'
import type { WalletFindManyInput } from './wallet-find-many-input.ts'

import { walletFindManySchema } from './wallet-find-many-schema.ts'
import { walletSanitizer } from './wallet-sanitizer.ts'

export async function walletFindMany(db: Database, input: WalletFindManyInput = {}): Promise<Wallet[]> {
  const parsedInput = walletFindManySchema.parse(input)
  return db.transaction('r', db.wallets, db.accounts, async () => {
    const [result1, result2] = await Promise.all([
      Result.tryPromise(() =>
        db.wallets
          .orderBy('order')
          .filter((item) => {
            const matchId = !parsedInput.id || item.id === parsedInput.id
            const matchName = !parsedInput.name || item.name.includes(parsedInput.name)

            return matchId && matchName
          })
          .toArray(),
      ),
      Result.tryPromise(() => db.accounts.orderBy('order').toArray()),
    ])

    if (Result.isError(result1)) {
      console.log(result1.error)
      throw new Error(`Error finding wallets`)
    }
    if (Result.isError(result2)) {
      console.log(result2.error)
      throw new Error(`Error finding accounts`)
    }
    return [
      ...result1.value.map((wallet) => {
        return {
          ...walletSanitizer(wallet),
          accounts: [...result2.value.filter((account) => account.walletId === wallet.id)],
        }
      }),
    ]
  })
}
