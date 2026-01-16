import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'
import { settingSetValue } from '../setting/setting-set-value.ts'
import { accountCreateDetermineOrder } from './account-create-determine-order.ts'
import type { AccountCreateInput } from './account-create-input.ts'
import { accountCreateSchema } from './account-create-schema.ts'

export async function accountCreate(db: Database, input: AccountCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = accountCreateSchema.parse(input)

  return db.transaction('rw', db.accounts, db.settings, db.wallets, async () => {
    const order = await accountCreateDetermineOrder(db, parsedInput.walletId)
    const result = await Result.tryPromise(() =>
      db.accounts.add({
        ...parsedInput,
        createdAt: now,
        derivationIndex: parsedInput.derivationIndex ?? 0,
        id: randomId(),
        order: order,
        secretKey: parsedInput.secretKey,
        updatedAt: now,
      }),
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error creating account`)
    }

    const activeAccountId = (await settingFindUnique(db, 'activeAccountId'))?.value
    if (!activeAccountId) {
      await settingSetValue(db, 'activeAccountId', result.value)
    }

    return result.value
  })
}
