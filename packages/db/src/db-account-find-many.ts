import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { AccountInputFindMany } from './dto/account-input-find-many'
import type { Account } from './entity/account'

import { accountSchemaFindMany } from './schema/account-schema-find-many'

export async function dbAccountFindMany(db: Database, input: AccountInputFindMany = {}): Promise<Account[]> {
  const parsedInput = accountSchemaFindMany.parse(input)
  return db.transaction('r', db.accounts, db.wallets, async () => {
    const [{ data: dataAccounts, error: accountsError }, { data: dataWallets, error: errorWallets }] =
      await Promise.all([
        tryCatch(
          db.accounts
            .orderBy('name')
            .filter((item) => {
              const matchId = !parsedInput.id || item.id === parsedInput.id
              const matchName = !parsedInput.name || item.name.includes(parsedInput.name)

              return matchId && matchName
            })
            .toArray(),
        ),
        tryCatch(db.wallets.toArray()),
      ])

    if (accountsError) {
      console.log(accountsError)
      throw new Error(`Error finding accounts`)
    }
    if (errorWallets) {
      console.log(errorWallets)
      throw new Error(`Error finding wallets`)
    }
    return [
      ...dataAccounts.map((account) => {
        return {
          ...account,
          wallets: [...dataWallets.filter((wallet) => wallet.accountId === account.id)],
        }
      }),
    ]
  })
}
