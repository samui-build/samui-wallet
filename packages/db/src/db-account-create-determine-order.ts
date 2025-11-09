import { Effect } from 'effect'

import type { Database } from './database.ts'

export async function dbAccountCreateDetermineOrder(db: Database): Promise<number> {
  const data = Effect.tryPromise({
    catch: (error) => new Error(`Error finding last account: ${String(error)}`),
    try: () => db.accounts.orderBy('order').last(),
  }).pipe(Effect.map((data) => (data ? data.order + 1 : 0)))

  const result = await Effect.runPromise(data)
  return result
}
