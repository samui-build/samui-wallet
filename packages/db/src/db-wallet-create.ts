import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { WalletInputCreate } from './dto/wallet-input-create'

import { walletSchemaCreate } from './schema/wallet-schema-create'

export async function dbWalletCreate(db: Database, input: WalletInputCreate): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.wallets.add({
      ...walletSchemaCreate.parse(input),
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
