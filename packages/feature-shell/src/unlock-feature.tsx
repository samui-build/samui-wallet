import { useWalletActive } from '@workspace/db-react/use-wallet-active'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastError } from '@workspace/ui/lib/toast-error'
import type { WalletProtectionMode } from '@workspace/vault/encrypted-value-schema'
import { useVaultUnlock } from '@workspace/vault-react/use-vault-unlock'
import { useWalletAutoUnlock } from '@workspace/vault-react/use-wallet-auto-unlock'
import { useWalletUnlock } from '@workspace/vault-react/use-wallet-unlock'
import type { SubmitEvent } from 'react'
import { useId, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export default function UnlockFeature() {
  const credentialId = useId()
  const navigate = useNavigate()
  const wallet = useWalletActive()
  const [credential, setCredential] = useState('')
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/portfolio'
  const protectionMode = wallet.protectionMode
  const unlockVaultMutation = useVaultUnlock({
    onError: (caught) => toastError(caught.message),
    onSuccess: async () => {
      setCredential('')
      await navigate(next)
    },
  })
  const unlockWalletMutation = useWalletUnlock({
    onError: (caught) => toastError(caught.message),
    onSuccess: async () => {
      setCredential('')
      await navigate(next)
    },
  })
  const autoUnlockQuery = useWalletAutoUnlock({
    enabled: protectionMode === 'unsecured',
    onUnlocked: async () => await navigate(next),
    scope: next,
    walletId: wallet.id,
  })

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    switch (protectionMode) {
      case 'password':
        await unlockVaultMutation.mutateAsync({ password: credential }).catch(() => undefined)
        break
      case 'pin':
        await unlockWalletMutation.mutateAsync({ credential, walletId: wallet.id }).catch(() => undefined)
        break
      case 'unsecured':
        await unlockWalletMutation.mutateAsync({ credential: '', walletId: wallet.id }).catch(() => undefined)
        break
    }
  }

  const credentialLabel = getCredentialLabel(protectionMode)
  const isBusy = unlockVaultMutation.isPending || unlockWalletMutation.isPending || autoUnlockQuery.isFetching

  return (
    <UiCard
      contentProps={{ className: 'space-y-4 md:py-2' }}
      description={`Unlock ${wallet.name} to continue.`}
      title="Unlock wallet"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {credentialLabel ? (
          <div className="space-y-2">
            <Label htmlFor={credentialId}>{credentialLabel}</Label>
            <Input
              autoComplete={protectionMode === 'password' ? 'current-password' : 'off'}
              id={credentialId}
              inputMode={protectionMode === 'pin' ? 'numeric' : undefined}
              onChange={(event) => setCredential(event.target.value)}
              pattern={protectionMode === 'pin' ? '[0-9]*' : undefined}
              type="password"
              value={credential}
            />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">This wallet does not require a password.</p>
        )}
        {autoUnlockQuery.error ? <p className="text-destructive text-sm">{autoUnlockQuery.error.message}</p> : null}
        <Button disabled={isBusy} type="submit">
          Unlock
        </Button>
      </form>
    </UiCard>
  )
}

function getCredentialLabel(mode: WalletProtectionMode): null | string {
  switch (mode) {
    case 'password':
      return 'Password'
    case 'pin':
      return 'PIN'
    case 'unsecured':
      return null
  }
}
