import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { Account } from './entity/account.ts'

export async function dbAccountFindUnique(db: Database, id: string): Promise<Account | null> {
  const result = Effect.tryPromise({
    catch: (error) => new Error(`Error finding account with id ${id}: ${error}`),
    try: () => db.accounts.get(id),
  })

  const data = await Effect.runPromise(result)

  return data ? data : null
}
