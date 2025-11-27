import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'

export function walletReadMnemonic(db: Database, id: string) {
  return db.transaction('r', db.wallets, async () => {
    const { data: wallet, error } = await tryCatch(db.wallets.get(id))
    if (error) {
      console.log(error)
      throw new Error(`Error finding wallet with id ${id}`)
    }
    if (!wallet) {
      throw new Error(`Wallet with id ${id} not found`)
    }
    // TODO: Decrypt wallet.secret here and use it to decrypt wallet.mnemonic
    return wallet.mnemonic
  })
}
