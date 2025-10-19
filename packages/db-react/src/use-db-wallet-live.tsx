import type { Wallet } from '@workspace/db/entity/wallet'

import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

import { useDbPreferenceFindUniqueByKeyLive } from './use-db-preference-find-unique-by-key-live'

export function useDbWalletLive() {
  const accountId = useDbPreferenceFindUniqueByKeyLive({ key: 'activeAccountId' })
  return useLiveQuery<Wallet[], Wallet[]>(
    () => {
      return db.wallets
        .orderBy('derivationIndex')
        .filter((item) => {
          return !!accountId && item.accountId === accountId.value
        })
        .toArray()
    },
    [accountId],
    [],
  )
}
