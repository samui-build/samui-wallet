import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'

export async function dbWalletDelete(db: Database, id: string): Promise<void> {
  const { data, error } = await tryCatch(db.wallets.delete(id))
  if (error) {
    console.log(error)
    throw new Error(`Error deleting wallet with id ${id}`)
  }
  return data
}
