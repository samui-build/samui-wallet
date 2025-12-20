import { useAccountsLive } from './use-accounts-live.tsx'

export function useAccountsForWalletLive({ walletId }: { walletId: string }) {
  const accounts = useAccountsLive()
  return accounts.filter((account) => account.walletId === walletId)
}
