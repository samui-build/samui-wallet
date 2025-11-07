import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import { dbSettingGetValue } from './db-setting-get-value.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import type { WalletInputCreate } from './dto/wallet-input-create.ts'
import { walletSchemaCreate } from './schema/wallet-schema-create.ts'

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

  const activeWalletId = await dbSettingGetValue(db, 'activeWalletId')
  if (!activeWalletId) {
    await dbSettingSetValue(db, 'activeWalletId', data)
  }

  return data
}
