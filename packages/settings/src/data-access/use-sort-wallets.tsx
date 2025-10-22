import type { Wallet } from '@workspace/db/entity/wallet'

import { useMemo } from 'react'

export function useSortWallets(wallets: Wallet[]) {
  return useMemo(
    () => [...wallets].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)),
    [wallets],
  )
}
