import type { Wallet } from '@workspace/db/entity/wallet'

import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

import { useDbPreference } from './use-db-preference'

export function useDbWalletLive() {
  const [accountId] = useDbPreference('activeAccountId')
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
