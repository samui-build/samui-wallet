import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { WalletInputCreate } from './dto/wallet-input-create'

import { dbPreferenceCreate } from './db-preference-create'
import { dbPreferenceFindUniqueByKey } from './db-preference-find-unique-by-key'
import { walletSchemaCreate } from './schema/wallet-schema-create'

export async function dbWalletCreate(db: Database, input: WalletInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = walletSchemaCreate.parse(input)
  const { data, error } = await tryCatch(
    db.wallets.add({
      ...parsedInput,
      createdAt: now,
      derivationIndex: parsedInput.derivationIndex ?? 0,
      id: crypto.randomUUID(),
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating wallet`)
  }

  const activeWalletId = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')
  if (!activeWalletId) {
    await dbPreferenceCreate(db, { key: 'activeWalletId', value: data })
  }

  return data
}
