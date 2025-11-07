import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import { dbAccountCreateDetermineOrder } from './db-account-create-determine-order.ts'
import { dbSettingGetValue } from './db-setting-get-value.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import type { AccountInputCreate } from './dto/account-input-create.ts'
import { accountSchemaCreate } from './schema/account-schema-create.ts'

export async function dbAccountCreate(db: Database, input: AccountInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = accountSchemaCreate.parse(input)

  return db.transaction('rw', db.accounts, db.settings, db.wallets, async () => {
    const order = await dbAccountCreateDetermineOrder(db)

    const { data, error } = await tryCatch(
      db.accounts.add({
        ...parsedInput,
        createdAt: now,
        id: crypto.randomUUID(),
        order,
        updatedAt: now,
        wallets: [],
      }),
    )
    if (error) {
      console.log(error)
      throw new Error(`Error creating account`)
    }

    const activeAccountId = await dbSettingGetValue(db, 'activeAccountId')
    if (!activeAccountId) {
      await dbSettingSetValue(db, 'activeAccountId', data)
    }
    return data
  })
}
