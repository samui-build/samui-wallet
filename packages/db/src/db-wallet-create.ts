import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import { dbSettingGetValue } from './db-setting-get-value.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import { dbWalletCreateDetermineOrder } from './db-wallet-create-determine-order.ts'
import type { WalletInputCreate } from './dto/wallet-input-create.ts'
import { walletSchemaCreate } from './schema/wallet-schema-create.ts'

export async function dbWalletCreate(db: Database, input: WalletInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = walletSchemaCreate.parse(input)

  return db.transaction('rw', db.wallets, db.settings, db.accounts, async () => {
    const order = await dbWalletCreateDetermineOrder(db)

    const { data, error } = await tryCatch(
      db.wallets.add({
        ...parsedInput,
        accounts: [],
        createdAt: now,
        id: crypto.randomUUID(),
        order,
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
  })
}
