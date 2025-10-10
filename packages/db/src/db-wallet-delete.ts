import { tryCatch } from '@workspace/core/try-catch'

import type { Db } from './db'

export async function dbWalletDelete(db: Db, id: string): Promise<void> {
  const { data, error } = await tryCatch(db.wallets.delete(id))
  if (error) {
    console.log(error)
    throw new Error(`Error deleting wallet with id ${id}`)
  }
  return data
}
