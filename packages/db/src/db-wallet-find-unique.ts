import { tryCatch } from '@workspace/core/try-catch'
import type { Db } from './db'
import { Wallet } from './entity/wallet'

export async function dbWalletFindUnique(db: Db, id: string): Promise<Wallet | undefined> {
  const { data, error } = await tryCatch(db.wallets.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding wallet with id ${id}`)
  }
  return data
}
