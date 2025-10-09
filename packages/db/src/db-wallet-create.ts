import { tryCatch } from '@workspace/core/try-catch'
import type { Db } from './db'
import { Wallet } from './entity/wallet'

export type DbWalletCreateInput = Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>

export async function dbWalletCreate(db: Db, input: DbWalletCreateInput): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.wallets.add({
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating wallet`)
  }
  return data
}
