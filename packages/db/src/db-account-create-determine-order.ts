import { Effect } from 'effect'

import type { Database } from './database.ts'

export async function dbAccountCreateDetermineOrder(db: Database, walletId: string): Promise<number> {
  const result = Effect.tryPromise({
    catch: (error) => new Error(`Error finding last account: ${String(error)}`),
    try: () =>
      db.accounts
        .orderBy('order')
        .and((x) => x.walletId === walletId)
        .last(),
  }).pipe(Effect.map((data) => (data ? data.order + 1 : 0)))
  const data = await Effect.runPromise(result)
  return data
}
