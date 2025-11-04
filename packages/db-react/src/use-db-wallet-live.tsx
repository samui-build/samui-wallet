import { db } from '@workspace/db/db'
import type { Wallet } from '@workspace/db/entity/wallet'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbWalletLive({ accountId }: { accountId?: null | string } = {}) {
  return useLiveQuery<Wallet[], Wallet[]>(
    () =>
      db.wallets
        .orderBy('derivationIndex')
        .filter((item) => (accountId ? item.accountId === accountId : true))
        .toArray(),
    [accountId],
    [],
  )
}
