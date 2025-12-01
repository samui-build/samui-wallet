import { db } from '@workspace/db/db'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useWalletLive() {
  const data = useRootLoaderData()
  if (!data?.wallets) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Wallet[], Wallet[]>(() => walletFindMany(db), [], data.wallets)
}
