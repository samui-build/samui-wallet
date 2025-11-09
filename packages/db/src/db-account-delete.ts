import { Effect } from 'effect'
import type { Database } from './database.ts'

export async function dbAccountDelete(db: Database, id: string): Promise<void> {
  const result = Effect.tryPromise({
    catch: (error) => new Error(`Error deleting account with id ${id}: ${error}`),
    try: () => db.accounts.delete(id),
  })

  const data = await Effect.runPromise(result)

  return data
}
