import { useTranslation } from '@workspace/i18n'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { VAULT_PASSWORD_MIN_LENGTH } from '@workspace/vault/encrypted-value-schema'
import { useVaultLock } from '@workspace/vault-react/use-vault-lock'
import { useVaultPasswordSubmit } from '@workspace/vault-react/use-vault-password-submit'
import { useVaultStatus } from '@workspace/vault-react/use-vault-status'
import type { SubmitEvent } from 'react'
import { useId, useState } from 'react'
import { useSettingsPage } from './data-access/use-settings-page.tsx'

export function SettingsFeatureSecurity() {
  const { t } = useTranslation('settings')
  const confirmPasswordId = useId()
  const page = useSettingsPage({ pageId: 'security' })
  const passwordId = useId()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [password, setPassword] = useState('')
  const vaultStatusQuery = useVaultStatus()
  const isConfigured = vaultStatusQuery.data?.isConfigured ?? false
  const isUnlocked = vaultStatusQuery.data?.isUnlocked ?? false
  const submitMutation = useVaultPasswordSubmit({
    onSuccess: (result) => {
      setConfirmPassword('')
      setPassword('')
      toastSuccess(result === 'configured' ? t(($) => $.securityStatusConfigured) : t(($) => $.securityStatusUnlocked))
    },
  })
  const lockMutation = useVaultLock({
    onError: (caught) => toastError(caught.message),
    onSuccess: () => {
      setPassword('')
      toastSuccess(t(($) => $.securityStatusLocked))
    },
  })

  async function handlePasswordSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    await submitMutation
      .mutateAsync({
        confirmPassword,
        password,
        passwordMinLength: VAULT_PASSWORD_MIN_LENGTH,
      })
      .catch(() => undefined)
  }

  function handleLock() {
    lockMutation.mutate()
  }

  const status = !isConfigured
    ? t(($) => $.securityStatusMissing)
    : isUnlocked
      ? t(($) => $.securityStatusUnlocked)
      : t(($) => $.securityStatusLocked)
  const isBusy = vaultStatusQuery.isLoading || submitMutation.isPending || lockMutation.isPending

  return (
    <div className="space-y-2 md:space-y-4">
      <UiCard
        contentProps={{ className: 'space-y-4 md:space-y-6 md:py-2' }}
        description={page.description}
        title={page.name}
      >
        <div className="flex items-center gap-2">
          <Badge variant={isConfigured ? 'secondary' : 'outline'}>
            {isConfigured ? t(($) => $.securityStatusConfigured) : t(($) => $.securityStatusMissing)}
          </Badge>
          <Badge variant={isUnlocked ? 'success' : 'outline'}>{status}</Badge>
        </div>

        {!isConfigured || !isUnlocked ? (
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-2">
              <Label htmlFor={passwordId}>{t(($) => $.securityInputPasswordLabel)}</Label>
              <Input
                autoComplete={isConfigured ? 'current-password' : 'new-password'}
                id={passwordId}
                onChange={(event) => {
                  submitMutation.reset()
                  setPassword(event.target.value)
                }}
                type="password"
                value={password}
              />
            </div>
            {!isConfigured ? (
              <div className="space-y-2">
                <Label htmlFor={confirmPasswordId}>{t(($) => $.securityInputConfirmPasswordLabel)}</Label>
                <Input
                  autoComplete="new-password"
                  id={confirmPasswordId}
                  onChange={(event) => {
                    submitMutation.reset()
                    setConfirmPassword(event.target.value)
                  }}
                  type="password"
                  value={confirmPassword}
                />
              </div>
            ) : null}
            {submitMutation.error ? <p className="text-destructive text-sm">{submitMutation.error.message}</p> : null}
            <Button disabled={isBusy} type="submit">
              {isConfigured ? t(($) => $.securityActionUnlock) : t(($) => $.securityActionCreateVault)}
            </Button>
          </form>
        ) : (
          <Button disabled={isBusy} onClick={handleLock} type="button" variant="outline">
            {t(($) => $.securityActionLock)}
          </Button>
        )}
      </UiCard>
    </div>
  )
}
