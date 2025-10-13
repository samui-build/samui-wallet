import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { AccountInputUpdate } from './dto/account-input-update'

import { accountSchemaUpdate } from './schema/account-schema-update'

export async function dbAccountUpdate(db: Database, id: string, input: AccountInputUpdate): Promise<number> {
  const { data, error } = await tryCatch(
    db.accounts.update(id, {
      ...accountSchemaUpdate.parse(input),
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating account with id ${id}`)
  }
  return data
}
