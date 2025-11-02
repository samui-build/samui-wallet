import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.js'
import type { WalletInputFindMany } from './dto/wallet-input-find-many.js'
import type { Wallet } from './entity/wallet.js'

import { walletSchemaFindMany } from './schema/wallet-schema-find-many.js'

export async function dbWalletFindMany(db: Database, input: WalletInputFindMany): Promise<Wallet[]> {
  const parsedInput = walletSchemaFindMany.parse(input)
  const { data, error } = await tryCatch(
    db.wallets
      .orderBy('derivationIndex')
      .filter((item) => {
        const matchAccountId = item.accountId === parsedInput.accountId
        const matchId = !parsedInput.id || item.id === parsedInput.id
        const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
        const matchPublicKey = !parsedInput.publicKey || item.publicKey === parsedInput.publicKey
        const matchType = !parsedInput.type || item.type === parsedInput.type

        return matchAccountId && matchId && matchName && matchPublicKey && matchType
      })
      .toArray(),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error finding wallets for account id ${parsedInput.accountId}`)
  }
  return data
}
