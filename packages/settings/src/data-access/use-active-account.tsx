import { useDbAccountActive } from '@workspace/db-react/use-db-account-active'
import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbAccountSetActive } from '@workspace/db-react/use-db-account-set-active'
import { useDbWalletActive } from '@workspace/db-react/use-db-wallet-active'
import { useSortAccounts } from './use-sort-accounts.tsx'

export function useActiveAccount() {
  const wallet = useDbWalletActive()
  const { mutateAsync } = useDbAccountSetActive()
  const accounts = useDbAccountLive({ walletId: wallet.id })
  const sorted = useSortAccounts(accounts)
  const active = useDbAccountActive()

  return {
    accounts: sorted,
    active,
    setActive: (id: string) => mutateAsync({ id }),
  }
}
