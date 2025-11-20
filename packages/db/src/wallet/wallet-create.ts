import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import { settingGetValue } from '../setting/setting-get-value.ts'
import { settingSetValue } from '../setting/setting-set-value.ts'
import { walletCreateDetermineOrder } from './wallet-create-determine-order.ts'
import type { WalletCreateInput } from './wallet-create-input.ts'
import { walletCreateSchema } from './wallet-create-schema.ts'

export async function walletCreate(db: Database, input: WalletCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = walletCreateSchema.parse(input)

  return db.transaction('rw', db.wallets, db.settings, db.accounts, async () => {
    const order = await walletCreateDetermineOrder(db)

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
