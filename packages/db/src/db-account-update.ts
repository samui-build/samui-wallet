import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { AccountInputUpdate } from './dto/account-input-update.ts'

import { parseStrict } from './parse-strict.ts'
import { accountSchemaUpdate } from './schema/account-schema-update.ts'

export async function dbAccountUpdate(db: Database, id: string, input: AccountInputUpdate): Promise<number> {
  const parsedInput = parseStrict(accountSchemaUpdate.parse(input))

  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error updating account with id ${id}`)
    },
    try: () =>
      db.accounts.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
  })

  const data = await Effect.runPromise(result)

  return data
}
