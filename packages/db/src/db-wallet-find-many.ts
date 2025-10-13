import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { WalletInputFindMany } from './dto/wallet-input-find-many'
import type { Wallet } from './entity/wallet'

import { walletSchemaFindMany } from './schema/wallet-schema-find-many'

export async function dbWalletFindMany(db: Database, input: WalletInputFindMany): Promise<Wallet[]> {
  const parsedInput = walletSchemaFindMany.parse(input)
  const { data, error } = await tryCatch(db.wallets.where('accountId').equals(parsedInput.accountId).toArray())
  if (error) {
    console.log(error)
    throw new Error(`Error finding wallets for account id ${parsedInput.accountId}`)
  }
  return data?.filter((item) => {
    const matchId = !parsedInput.id || item.id === parsedInput.id
    const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
    const matchPublicKey = !parsedInput.publicKey || item.publicKey === parsedInput.publicKey
    const matchType = !parsedInput.type || item.type === parsedInput.type

    return matchId && matchName && matchPublicKey && matchType
  })
}
