import { tryCatch } from '@workspace/core/try-catch'

import type { Db } from './db'
import type { Wallet } from './entity/wallet'

export type DbWalletCreateInput = Omit<Wallet, 'createdAt' | 'id' | 'updatedAt'>

export async function dbWalletCreate(db: Db, input: DbWalletCreateInput): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.wallets.add({
      ...input,
      createdAt: now,
      id: crypto.randomUUID(),
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating wallet`)
  }
  return data
}
