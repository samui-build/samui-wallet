import { db } from '@workspace/db/db'
import { dbWalletFindMany } from '@workspace/db/db-wallet-find-many'
import type { Wallet } from '@workspace/db/entity/wallet'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbWalletLive() {
  return useLiveQuery<Wallet[], Wallet[]>(() => dbWalletFindMany(db), [], [])
}
