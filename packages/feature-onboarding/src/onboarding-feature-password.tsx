import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { UiBackButton } from '@workspace/ui/components/ui-back-button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useVaultPasswordSubmit } from '@workspace/vault-react/use-vault-password-submit'
import { useVaultStatus } from '@workspace/vault-react/use-vault-status'
import type { SubmitEvent } from 'react'
import { useId, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'

type OnboardingPasswordNext = 'generate' | 'import'

const VAULT_PASSWORD_MIN_LENGTH = 8

export function OnboardingFeaturePassword() {
  const { t } = useTranslation('onboarding')
  const confirmPasswordId = useId()
  const navigate = useNavigate()
  const passwordId = useId()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [password, setPassword] = useState('')
  const [searchParams] = useSearchParams()
  const next = parseNext(searchParams.get('next'))
  const vaultStatusQuery = useVaultStatus()
  const isConfigured = vaultStatusQuery.data?.isConfigured ?? null
  const isUnlocked = vaultStatusQuery.data?.isUnlocked ?? false
  const submitMutation = useVaultPasswordSubmit({
    onSuccess: async () => {
      setConfirmPassword('')
      setPassword('')
      if (next) {
        await navigate(`/onboarding/${next}`)
      }
    },
  })

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!next || isConfigured === null) {
      return
    }
    await submitMutation
      .mutateAsync({
        confirmPassword,
        password,
        passwordMinLength: VAULT_PASSWORD_MIN_LENGTH,
      })
      .catch(() => undefined)
  }

  if (!next) {
    return <Navigate replace to="/onboarding" />
  }

  return (
    <form onSubmit={submit}>
      <UiCard
        description={t(($) => $.passwordCardDescription)}
        footer={
          <Button className="ml-auto" disabled={submitMutation.isPending || isConfigured === null} type="submit">
            {t(($) => $.passwordButtonContinue)}
          </Button>
        }
        title={
          <div>
            <UiBackButton className="mr-2" />
            {t(($) => $.passwordCardTitle)}
          </div>
        }
      >
        <div className="space-y-4">
          {!isConfigured || !isUnlocked ? (
            <div className="space-y-2">
              <Label htmlFor={passwordId}>{t(($) => $.passwordLabel)}</Label>
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
          ) : null}
          {isConfigured === false ? (
            <div className="space-y-2">
              <Label htmlFor={confirmPasswordId}>{t(($) => $.passwordConfirmLabel)}</Label>
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
        </div>
      </UiCard>
    </form>
  )
}

function parseNext(value: null | string): OnboardingPasswordNext | null {
  switch (value) {
    case 'generate':
    case 'import':
      return value
    default:
      return null
  }
}
