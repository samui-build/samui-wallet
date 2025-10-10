import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { Wallet } from './entity/wallet'

export type DbWalletFindManyInput = Partial<Pick<Wallet, 'id' | 'name' | 'publicKey' | 'type'>> &
  Pick<Wallet, 'accountId'>

export async function dbWalletFindMany(db: Database, input: DbWalletFindManyInput): Promise<Wallet[]> {
  const { data, error } = await tryCatch(db.wallets.where('accountId').equals(input.accountId).toArray())
  if (error) {
    console.log(error)
    throw new Error(`Error finding wallets for account id ${input.accountId}`)
  }
  return data?.filter((item) => {
    const matchId = !input.id || item.id === input.id
    const matchName = !input.name || item.name.includes(input.name)
    const matchPublicKey = !input.publicKey || item.publicKey === input.publicKey
    const matchType = !input.type || item.type === input.type

    return matchId && matchName && matchPublicKey && matchType
  })
}
