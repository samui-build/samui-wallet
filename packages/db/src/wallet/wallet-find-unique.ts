import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { Wallet } from './wallet.ts'

export async function walletFindUnique(db: Database, id: string): Promise<Wallet | null> {
  const { data, error } = await tryCatch(db.wallets.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding wallet with id ${id}`)
  }
  return data ? data : null
}
