import type { Wallet } from '@workspace/db/entity/wallet'

import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbWalletLive({ accountId }: { accountId: null | string }) {
  return useLiveQuery<Wallet[], Wallet[]>(
    () =>
      db.wallets
        .orderBy('derivationIndex')
        .filter((item) => !!accountId && item.accountId === accountId)
        .toArray(),
    [accountId],
    [],
  )
}
