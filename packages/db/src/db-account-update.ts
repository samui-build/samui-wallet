import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { AccountInputUpdate } from './dto/account-input-update'

import { parseStrict } from './parse-strict'
import { accountSchemaUpdate } from './schema/account-schema-update'

export async function dbAccountUpdate(db: Database, id: string, input: AccountInputUpdate): Promise<number> {
  const parsedInput = parseStrict(accountSchemaUpdate.parse(input))
  const { data, error } = await tryCatch(
    db.accounts.update(id, {
      ...parsedInput,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating account with id ${id}`)
  }
  return data
}
