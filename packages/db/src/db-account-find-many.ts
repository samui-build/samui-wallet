import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { AccountInputFindMany } from './dto/account-input-find-many'
import type { Account } from './entity/account'

import { accountSchemaFindMany } from './schema/account-schema-find-many'

export async function dbAccountFindMany(db: Database, input: AccountInputFindMany = {}): Promise<Account[]> {
  const parsedInput = accountSchemaFindMany.parse(input)
  const { data, error } = await tryCatch(
    db.accounts
      .orderBy('name')
      .filter((item) => {
        const matchId = !parsedInput.id || item.id === parsedInput.id
        const matchName = !parsedInput.name || item.name.includes(parsedInput.name)

        return matchId && matchName
      })
      .toArray(),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error finding accounts`)
  }
  return data
}
