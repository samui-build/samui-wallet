import { useAccountSetActive } from '@workspace/db-react/use-account-set-active'
import { useAccountsForActiveWalletLive } from '@workspace/db-react/use-accounts-for-active-wallet-live'
import { useSetting } from '@workspace/db-react/use-setting'
import { useMemo } from 'react'
import { useSortAccounts } from './use-sort-accounts.tsx'

export function useActiveAccount() {
  const [accountId] = useSetting('activeAccountId')
  const accounts = useAccountsForActiveWalletLive()
  const { mutateAsync } = useAccountSetActive()

  const sorted = useSortAccounts(accounts)
  const active = useMemo(() => accounts.find((c) => c.id === accountId) ?? null, [accounts, accountId])

  return {
    accounts: sorted,
    active,
    setActive: (id: string) => mutateAsync({ id }),
  }
}
