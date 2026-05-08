import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useVaultLock, useVaultStatus, useVaultUnlockDialog } from '@workspace/vault-react/vault-unlock-provider'

function formatVaultStatus(value: boolean | undefined) {
  if (value === undefined) {
    return 'Unknown'
  }
  return value ? 'Yes' : 'No'
}

export default function DevFeatureVault() {
  const { requestUnlock } = useVaultUnlockDialog()
  const status = useVaultStatus()
  const lockVault = useVaultLock({
    onSuccess: () => {
      toastSuccess('Vault locked')
    },
  })
  const unlockVault = useMutation({
    mutationFn: () => requestUnlock(),
    onError: (error) => toastError(error instanceof Error ? error.message : 'Unable to request vault unlock'),
    onSuccess: (result) => {
      if (result) {
        toastSuccess('Vault unlocked successfully')
      } else {
        toastError('Vault unlock was cancelled or failed')
      }
    },
  })
  const isPending = lockVault.isPending || status.isPending || unlockVault.isPending
  const isConfigured = status.data?.isConfigured
  const isUnlocked = status.data?.isUnlocked
  const canLockVault = isUnlocked === true
  const canRequestUnlock = isUnlocked === false

  return (
    <UiCard description="Open the shared vault unlock/setup dialog from the dev surface." title="Vault unlock dialog">
      <div className="space-y-4">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Configured</dt>
            <dd>{formatVaultStatus(isConfigured)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Unlocked</dt>
            <dd>{formatVaultStatus(isUnlocked)}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <Button disabled={isPending || !canRequestUnlock} onClick={() => unlockVault.mutate()} variant="outline">
            Request Unlock
          </Button>
          <Button disabled={isPending || !canLockVault} onClick={() => lockVault.mutate()} variant="outline">
            Lock Vault
          </Button>
        </div>
      </div>
    </UiCard>
  )
}
