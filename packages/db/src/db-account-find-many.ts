import { Effect } from 'effect'
import type { Database } from './database.ts'
import type { AccountInputFindMany } from './dto/account-input-find-many.ts'
import type { Account } from './entity/account.ts'
import { accountSchemaFindMany } from './schema/account-schema-find-many.ts'

export async function dbAccountFindMany(db: Database, input: AccountInputFindMany = {}): Promise<Account[]> {
  const parsedInput = accountSchemaFindMany.parse(input)
  return db.transaction('r', db.accounts, db.wallets, async () => {
    const effectAccounts = Effect.tryPromise({
      catch: (error) => new Error(`Error finding accounts: ${String(error)}`),
      try: () =>
        db.accounts
          .orderBy('order')
          .filter((item) => {
            const matchId = !parsedInput.id || item.id === parsedInput.id
            const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
            return matchId && matchName
          })
          .toArray(),
    })

    const effectWallets = Effect.tryPromise({
      catch: (error) => new Error(`Error loading wallets: ${String(error)}`),
      try: () => db.wallets.toArray(),
    })

    const [dataAccounts, dataWallets] = await Effect.runPromise(Effect.all([effectAccounts, effectWallets]))

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
