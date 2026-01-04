import { useAccountsLive } from './use-accounts-live.tsx'

export function useAccountsForWalletLive({ walletId }: { walletId: string | undefined }) {
  const accounts = useAccountsLive()
  return walletId ? accounts.filter((account) => account.walletId === walletId) : []
}
