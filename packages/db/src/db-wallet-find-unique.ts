import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { Wallet } from './entity/wallet'

export async function dbWalletFindUnique(db: Database, id: string): Promise<null | Wallet> {
  const { data, error } = await tryCatch(db.wallets.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding wallet with id ${id}`)
  }
  return data ? data : null
}
