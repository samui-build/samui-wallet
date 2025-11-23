import { useWalletLive } from '@workspace/db-react/use-wallet-live'
import { useMemo } from 'react'

import { determineWalletName } from './determine-wallet-name.ts'

export function useDetermineWalletName() {
  const items = useWalletLive()

  return useMemo(() => determineWalletName(items), [items])
}
