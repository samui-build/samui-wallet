import type { Database } from './database.ts'
import type { Account } from './entity/account.ts'

export async function dbAccountFindByWalletId(db: Database, id?: string | null): Promise<Account[]> {
  return db.accounts
    .orderBy('derivationIndex')
    .filter(({ walletId }) => (id ? walletId === id : true))
    .toArray()
}
