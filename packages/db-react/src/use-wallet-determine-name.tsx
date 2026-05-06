import { walletDetermineName } from '@workspace/db/wallet/wallet-determine-name'
import { useMemo } from 'react'
import { useWalletLive } from './use-wallet-live.tsx'

export function useWalletDetermineName() {
  const wallets = useWalletLive()

  return useMemo(() => walletDetermineName(wallets), [wallets])
}
