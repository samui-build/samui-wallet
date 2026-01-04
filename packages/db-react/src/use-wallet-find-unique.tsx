import { useWalletLive } from './use-wallet-live.tsx'

export function useWalletFindUnique({ id }: { id: string | undefined }) {
  const wallets = useWalletLive()
  return id ? (wallets.find((w) => w.id === id) ?? null) : null
}
