import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { AccountInputCreate } from './dto/account-input-create'

import { dbPreferenceGetValue } from './db-preference-get-value'
import { dbPreferenceSetValue } from './db-preference-set-value'
import { accountSchemaCreate } from './schema/account-schema-create'

export async function dbAccountCreate(db: Database, input: AccountInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = accountSchemaCreate.parse(input)
  const { data, error } = await tryCatch(
    db.accounts.add({
      ...parsedInput,
      createdAt: now,
      id: crypto.randomUUID(),
      updatedAt: now,
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
}
