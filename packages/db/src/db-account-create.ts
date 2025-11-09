import { Effect } from 'effect'

import type { Database } from './database.ts'
import { dbAccountCreateDetermineOrder } from './db-account-create-determine-order.ts'
import { dbSettingGetValue } from './db-setting-get-value.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import type { AccountInputCreate } from './dto/account-input-create.ts'
import { accountSchemaCreate } from './schema/account-schema-create.ts'

export async function dbAccountCreate(db: Database, input: AccountInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = accountSchemaCreate.parse(input)

  const result = Effect.tryPromise({
    catch: (error) => new Error(`Error creating account: ${String(error)}`),
    try: async () => {
      return await db.transaction('rw', db.accounts, db.settings, db.wallets, async () => {
        const order = await dbAccountCreateDetermineOrder(db, parsedInput.walletId)
        const id = crypto.randomUUID()

        const accountId = await db.accounts.add({
          ...parsedInput,
          createdAt: now,
          derivationIndex: parsedInput.derivationIndex ?? 0,
          id,
          order,
          updatedAt: now,
        })

        const activeAccountId = await dbSettingGetValue(db, 'activeAccountId')
        if (!activeAccountId) {
          await dbSettingSetValue(db, 'activeAccountId', accountId)
        }

        return accountId
      })
    },
  })

  const data = await Effect.runPromise(result)
  return data
}
