import { db } from '@workspace/db/db'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbWalletLive() {
  return useLiveQuery<Wallet[], Wallet[]>(() => walletFindMany(db), [], [])
}
