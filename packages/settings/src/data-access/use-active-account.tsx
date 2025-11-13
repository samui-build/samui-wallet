import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbAccountSetActive } from '@workspace/db-react/use-db-account-set-active'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { useMemo } from 'react'

import { useSortAccounts } from './use-sort-accounts.tsx'

export function useActiveAccount() {
  const [accountId] = useDbSetting('activeAccountId')
  const [walletId] = useDbSetting('activeWalletId')
  const { mutateAsync } = useDbAccountSetActive()
  const accounts = useDbAccountLive({ walletId })
  const sorted = useSortAccounts(accounts)
  const active = useMemo(() => accounts.find((c) => c.id === accountId) ?? null, [accounts, accountId])

  return {
    accounts: sorted,
    active,
    setActive: (id: string) => mutateAsync({ id }),
  }
}
