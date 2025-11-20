import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import { dbWalletCreateDetermineOrder } from './db-wallet-create-determine-order.ts'
import type { WalletInputCreate } from './dto/wallet-input-create.ts'
import { walletSchemaCreate } from './schema/wallet-schema-create.ts'
import { settingGetValue } from './setting/setting-get-value.ts'
import { settingSetValue } from './setting/setting-set-value.ts'

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

    const activeWalletId = await settingGetValue(db, 'activeWalletId')
    if (!activeWalletId) {
      await settingSetValue(db, 'activeWalletId', data)
    }
    return data
  })
}
