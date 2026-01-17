import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import type { Wallet } from './wallet.ts'
import { walletSanitizer } from './wallet-sanitizer.ts'

export async function walletFindUnique(db: Database, id: string): Promise<Wallet | null> {
  return db.transaction('r', db.wallets, async () => {
    const result = await Result.tryPromise(() => db.wallets.get(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding wallet with id ${id}`)
    }
    return result.value ? walletSanitizer(result.value) : null
  })
}
