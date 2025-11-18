import { useDbWalletActive } from '@workspace/db-react/use-db-wallet-active'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { useDbWalletSetActive } from '@workspace/db-react/use-db-wallet-set-active'

export function useActiveWallet() {
  const wallets = useDbWalletLive()
  const { mutateAsync } = useDbWalletSetActive()
  const active = useDbWalletActive()

  return {
    active,
    setActive: (id: string) => mutateAsync({ id }),
    wallets,
  }
}
