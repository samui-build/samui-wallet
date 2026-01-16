import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'

export function walletReadMnemonic(db: Database, id: string) {
  return db.transaction('r', db.wallets, async () => {
    const result = await Result.tryPromise(() => db.wallets.get(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding wallet with id ${id}`)
    }
    if (!result.value) {
      throw new Error(`Wallet with id ${id} not found`)
    }
    // TODO: Decrypt wallet.secret here and use it to decrypt wallet.mnemonic
    return result.value.mnemonic
  })
}
