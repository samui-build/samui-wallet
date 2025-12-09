import { useWalletLive } from '@workspace/db-react/use-wallet-live'
import { useMemo } from 'react'

import { determineWalletName } from './determine-wallet-name.ts'

export function useDetermineWalletName() {
  const wallets = useWalletLive()

  return useMemo(() => determineWalletName(wallets), [wallets])
}
