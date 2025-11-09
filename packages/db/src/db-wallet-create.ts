import { Effect } from 'effect'

import type { Database } from './database.ts'
import { dbSettingGetValue } from './db-setting-get-value.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import { dbWalletCreateDetermineOrder } from './db-wallet-create-determine-order.ts'
import type { WalletInputCreate } from './dto/wallet-input-create.ts'
import { walletSchemaCreate } from './schema/wallet-schema-create.ts'

export async function dbWalletCreate(db: Database, input: WalletInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = walletSchemaCreate.parse(input)

  const result = Effect.tryPromise({
    catch: () => new Error(`Error creating wallet`),
    try: async () => {
      return await db.transaction('rw', db.wallets, db.settings, db.accounts, async () => {
        const order = await dbWalletCreateDetermineOrder(db)
        const id = crypto.randomUUID()

        const walletId = await db.wallets.add({
          ...parsedInput,
          accounts: [],
          createdAt: now,
          id,
          order,
          updatedAt: now,
        })

        const activeWalletId = await dbSettingGetValue(db, 'activeWalletId')
        if (!activeWalletId) {
          await dbSettingSetValue(db, 'activeWalletId', walletId)
        }

        return walletId
      })
    },
  })
  const data = await Effect.runPromise(result)

  return data
}
