import { useAppContext } from '@workspace/context-react/use-app-context'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useWalletLive() {
  const ctx = useAppContext()
  const data = useRootLoaderData()
  if (!data?.wallets) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Wallet[], Wallet[]>(() => walletFindMany(ctx), [ctx], data.wallets)
}
