import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { Wallet } from './wallet.ts'
import { walletSanitizer } from './wallet-sanitizer.ts'

export async function walletFindUnique(db: Database, id: string): Promise<Wallet | null> {
  return db.transaction('r', db.wallets, async () => {
    const { data, error } = await tryCatch(db.wallets.get(id))
    if (error) {
      console.log(error)
      throw new Error(`Error finding wallet with id ${id}`)
    }
    return data ? walletSanitizer(data) : null
  })
}
