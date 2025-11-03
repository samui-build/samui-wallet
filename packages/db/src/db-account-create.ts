import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import { dbAccountCreateDetermineOrder } from './db-account-create-determine-order.ts'
import { dbPreferenceGetValue } from './db-preference-get-value.ts'
import { dbPreferenceSetValue } from './db-preference-set-value.ts'
import type { AccountInputCreate } from './dto/account-input-create.ts'
import { accountSchemaCreate } from './schema/account-schema-create.ts'

export async function dbAccountCreate(db: Database, input: AccountInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = accountSchemaCreate.parse(input)

  return db.transaction('rw', db.accounts, db.preferences, db.wallets, async () => {
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

    const activeAccountId = await dbPreferenceGetValue(db, 'activeAccountId')
    if (!activeAccountId) {
      await dbPreferenceSetValue(db, 'activeAccountId', data)
    }
    return data
  })
}
