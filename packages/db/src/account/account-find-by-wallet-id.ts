import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import type { Account } from './account.ts'
import { accountSanitizer } from './account-sanitizer.ts'

export async function accountFindByWalletId(db: Database, id?: string | null): Promise<Account[]> {
  const { data, error } = await tryCatch(
    db.accounts
      .orderBy('derivationIndex')
      .filter(({ walletId }) => (id ? walletId === id : true))
      .toArray(),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error finding account with id ${id}`)
  }

  return data?.map((item) => accountSanitizer(item))
}
