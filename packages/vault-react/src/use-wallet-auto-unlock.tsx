import { useQuery } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'

export function useWalletAutoUnlock({
  enabled,
  onUnlocked,
  scope,
  walletId,
}: {
  enabled: boolean
  onUnlocked: () => Promise<void>
  scope: string
  walletId: string
}) {
  const context = useAppContext()
  return useQuery({
    enabled,
    gcTime: 0,
    queryFn: async () => {
      await context.vault.unlockWallet({ credential: '', walletId })
      await onUnlocked()
      return true
    },
    queryKey: ['walletAutoUnlock', walletId, scope],
    retry: false,
  })
}
