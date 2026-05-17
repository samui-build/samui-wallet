import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletProtectionMode } from '@workspace/db/wallet/wallet'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useWalletActive } from '@workspace/db-react/use-wallet-active'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useVaultUnlockDialog } from '@workspace/vault-react/vault-unlock-provider'

export type ShellUnlockGateState = {
  isChecking: boolean
  isLocked: boolean
  isUnlocking: boolean
  walletName: string
  walletProtectionMode: WalletProtectionMode
}

export type ShellUnlockGate = {
  actions: {
    unlock(): Promise<void>
  }
  state: ShellUnlockGateState
}

function shellUnlockStatusQueryKey(walletId: string) {
  return ['shellUnlockStatus', walletId] as const
}

export function useShellUnlockGate(): ShellUnlockGate {
  const account = useAccountActive()
  const context = useAppContext()
  const queryClient = useQueryClient()
  const wallet = useWalletActive()
  const { requestUnlock } = useVaultUnlockDialog()
  const statusQuery = useQuery({
    queryFn: async () => {
      try {
        await context.vault.requireWalletKey({ walletId: account.walletId })
        return true
      } catch {
        if (wallet.protectionMode === 'unsecured') {
          await context.vault.unlockWallet({ credential: '', walletId: account.walletId })
          return true
        }
        return false
      }
    },
    queryKey: shellUnlockStatusQueryKey(account.walletId),
    retry: false,
  })
  const unlockMutation = useMutation({
    mutationFn: async () =>
      await requestUnlock({
        mode: wallet.protectionMode,
        reason: 'generic',
        walletId: account.walletId,
      }),
    onError: (caught) => toastError(caught instanceof Error ? caught.message : `${caught}`),
    onSuccess: async (unlocked) => {
      if (unlocked) {
        await queryClient.invalidateQueries({ queryKey: shellUnlockStatusQueryKey(account.walletId) })
      }
    },
  })

  return {
    actions: {
      unlock: async () => {
        await unlockMutation.mutateAsync().catch(() => undefined)
      },
    },
    state: {
      isChecking: statusQuery.isLoading,
      isLocked: statusQuery.data === false,
      isUnlocking: unlockMutation.isPending,
      walletName: wallet.name,
      walletProtectionMode: wallet.protectionMode,
    },
  }
}
