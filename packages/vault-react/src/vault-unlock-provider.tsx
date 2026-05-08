import type { ReactNode } from 'react'
import { VaultUnlockDialogReact } from './data-access/use-vault-unlock-dialog.ts'
import { useVaultUnlockProvider } from './data-access/use-vault-unlock-provider.ts'
import { VaultUiUnlockDialog } from './ui/vault-ui-unlock-dialog.tsx'

export { useVaultLock } from './data-access/use-vault-lock.ts'
export { useVaultStatus } from './data-access/use-vault-status.ts'
export {
  useVaultUnlockDialog,
  type VaultUnlockDialogContext,
  type VaultUnlockMode,
  type VaultUnlockReason,
  type VaultUnlockRequest,
} from './data-access/use-vault-unlock-dialog.ts'

export function VaultUnlockProvider({ children }: { children: ReactNode }) {
  const { actions, contextValue, state } = useVaultUnlockProvider()

  return (
    <VaultUnlockDialogReact.Provider value={contextValue}>
      {children}
      <VaultUiUnlockDialog actions={actions} state={state} />
    </VaultUnlockDialogReact.Provider>
  )
}
