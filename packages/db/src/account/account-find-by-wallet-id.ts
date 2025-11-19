import type { Database } from '../database.ts'
import type { Account } from './account.ts'

export async function accountFindByWalletId(db: Database, id?: string | null): Promise<Account[]> {
  return db.accounts
    .orderBy('derivationIndex')
    .filter(({ walletId }) => (id ? walletId === id : true))
    .toArray()
}
