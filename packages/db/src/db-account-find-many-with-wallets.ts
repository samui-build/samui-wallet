import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { AccountInputFindMany } from './dto/account-input-find-many'
import type { Account } from './entity/account'
import type { Wallet } from './entity/wallet'

import { accountSchemaFindMany } from './schema/account-schema-find-many'

export type AccountWithWallets = { wallets: Wallet[] } & Account

export async function dbAccountFindManyWithWallets(
  db: Database,
  input: AccountInputFindMany = {},
): Promise<AccountWithWallets[]> {
  return db.transaction('r', db.accounts, db.wallets, async () => {
    const parsedInput = accountSchemaFindMany.parse(input)
    const { data, error } = await tryCatch(
      db.accounts
        .orderBy('name')
        .filter((item) => {
          const matchId = !parsedInput.id || item.id === parsedInput.id
          const matchName = !parsedInput.name || item.name.includes(parsedInput.name)

          return matchId && matchName
        })
        .toArray(),
    )
    if (error) {
      console.log(error)
      throw new Error(`Error finding accounts`)
    }
    const { data: wallets } = await tryCatch(db.wallets.orderBy('derivationIndex').toArray())
    return [...data].map((item) => ({
      ...item,
      wallets: (wallets ?? []).filter((wallet) => wallet.accountId === item.id),
    }))
  })
}
