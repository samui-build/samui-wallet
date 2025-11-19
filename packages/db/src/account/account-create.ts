import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import { dbSettingGetValue } from '../db-setting-get-value.ts'
import { dbSettingSetValue } from '../db-setting-set-value.ts'
import { accountCreateDetermineOrder } from './account-create-determine-order.ts'
import type { AccountCreateInput } from './account-create-input.ts'
import { accountCreateSchema } from './account-create-schema.ts'

export async function accountCreate(db: Database, input: AccountCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = accountCreateSchema.parse(input)

  return db.transaction('rw', db.accounts, db.settings, db.wallets, async () => {
    const order = await accountCreateDetermineOrder(db, parsedInput.walletId)
    const { data, error } = await tryCatch(
      db.accounts.add({
        ...parsedInput,
        createdAt: now,
        derivationIndex: parsedInput.derivationIndex ?? 0,
        id: crypto.randomUUID(),
        order: order,
        updatedAt: now,
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
