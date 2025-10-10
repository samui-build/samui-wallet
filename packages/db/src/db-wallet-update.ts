import { tryCatch } from '@workspace/core/try-catch'

import type { Db } from './db'
import type { Wallet } from './entity/wallet'

export type DbWalletUpdateInput = Partial<Omit<Wallet, 'createdAt' | 'id' | 'updatedAt'>>

export async function dbWalletUpdate(db: Db, id: string, input: DbWalletUpdateInput): Promise<number> {
  const { data, error } = await tryCatch(
    db.wallets.update(id, {
      ...input,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating wallet with id ${id}`)
  }
  return data
}
