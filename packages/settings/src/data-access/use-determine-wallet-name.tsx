import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { useMemo } from 'react'

import { determineWalletName } from './determine-wallet-name.ts'

export function useDetermineWalletName() {
  const items = useDbWalletLive()

  return useMemo(() => determineWalletName(items), [items])
}
