import { db } from '@workspace/db/db'
import type { Account } from '@workspace/db/entity/account'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbAccountLive({ walletId }: { walletId?: null | string } = {}) {
  return useLiveQuery<Account[], Account[]>(
    () =>
      db.accounts
        .orderBy('derivationIndex')
        .filter((item) => (walletId ? item.walletId === walletId : true))
        .toArray(),
    [walletId],
    [],
  )
}
