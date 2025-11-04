import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { WalletInputFindMany } from './dto/wallet-input-find-many.ts'
import type { Wallet } from './entity/wallet.ts'

import { walletSchemaFindMany } from './schema/wallet-schema-find-many.ts'

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
