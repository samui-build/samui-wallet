import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import type { Wallet } from './wallet.ts'

export async function walletFindUnique(db: Database, id: string): Promise<Wallet | null> {
  return db.transaction('r', db.wallets, async () => {
    const data = await tryCatchOrThrow(db.wallets.get(id), `Error finding wallet with id ${id}`)
    return data ?? null
  })
}
