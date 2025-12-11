import { useWalletLive } from './use-wallet-live.tsx'

export function useWalletFindUnique({ id }: { id: string }) {
  const wallets = useWalletLive()
  return wallets.find((w) => w.id === id) ?? null
}
