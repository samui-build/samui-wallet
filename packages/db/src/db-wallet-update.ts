import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { WalletInputUpdate } from './dto/wallet-input-update'

import { walletSchemaUpdate } from './schema/wallet-schema-update'

export async function dbWalletUpdate(db: Database, id: string, input: WalletInputUpdate): Promise<number> {
  const { data, error } = await tryCatch(
    db.wallets.update(id, {
      ...walletSchemaUpdate.parse(input),
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating wallet with id ${id}`)
  }
  return data
}
