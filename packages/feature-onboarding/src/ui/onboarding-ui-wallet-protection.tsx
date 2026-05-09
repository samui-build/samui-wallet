import { useTranslation } from '@workspace/i18n'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group'
import { VAULT_PIN_MAX_LENGTH, VAULT_PIN_MIN_LENGTH } from '@workspace/vault/encrypted-value-schema'
import { useId } from 'react'
import type { CreateNewWalletProtectionMode } from '../data-access/use-create-new-wallet.tsx'

export function OnboardingUiWalletProtection({
  onPinChange,
  onPinConfirmChange,
  onProtectionModeChange,
  onUnsecuredConfirmedChange,
  pin,
  pinConfirm,
  protectionMode,
  unsecuredConfirmed,
}: {
  onPinChange: (value: string) => void
  onPinConfirmChange: (value: string) => void
  onProtectionModeChange: (value: string) => void
  onUnsecuredConfirmedChange: (checked: boolean) => void
  pin: string
  pinConfirm: string
  protectionMode: CreateNewWalletProtectionMode
  unsecuredConfirmed: boolean
}) {
  const { t } = useTranslation('onboarding')
  const pinConfirmId = useId()
  const pinId = useId()
  const protectionId = useId()
  const unsecuredConfirmId = useId()

  return (
    <details className="space-y-4">
      <summary className="cursor-pointer text-muted-foreground text-sm">{t(($) => $.walletProtectionTitle)}</summary>
      <div className="space-y-4 pt-2">
        <ToggleGroup
          aria-label={t(($) => $.walletProtectionTitle)}
          className="grid w-full grid-cols-1 sm:grid-cols-3"
          id={protectionId}
          onValueChange={onProtectionModeChange}
          type="single"
          value={protectionMode}
          variant="outline"
        >
          <ToggleGroupItem
            className="h-auto min-h-9 whitespace-normal px-3 py-2 text-center leading-snug"
            value="password"
          >
            {t(($) => $.walletProtectionPassword)}
          </ToggleGroupItem>
          <ToggleGroupItem className="h-auto min-h-9 whitespace-normal px-3 py-2 text-center leading-snug" value="pin">
            {t(($) => $.walletProtectionPin)}
          </ToggleGroupItem>
          <ToggleGroupItem
            className="h-auto min-h-9 whitespace-normal px-3 py-2 text-center leading-snug"
            value="unsecured"
          >
            {t(($) => $.walletProtectionUnsecured)}
          </ToggleGroupItem>
        </ToggleGroup>
        {protectionMode === 'pin' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={pinId}>{t(($) => $.walletProtectionPinLabel)}</Label>
              <Input
                autoComplete="off"
                id={pinId}
                inputMode="numeric"
                maxLength={VAULT_PIN_MAX_LENGTH}
                minLength={VAULT_PIN_MIN_LENGTH}
                onChange={(event) => onPinChange(event.target.value)}
                pattern="[0-9]*"
                type="password"
                value={pin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={pinConfirmId}>{t(($) => $.walletProtectionPinConfirmLabel)}</Label>
              <Input
                autoComplete="off"
                id={pinConfirmId}
                inputMode="numeric"
                maxLength={VAULT_PIN_MAX_LENGTH}
                minLength={VAULT_PIN_MIN_LENGTH}
                onChange={(event) => onPinConfirmChange(event.target.value)}
                pattern="[0-9]*"
                type="password"
                value={pinConfirm}
              />
            </div>
          </div>
        ) : null}
        {protectionMode === 'unsecured' ? (
          <div className="space-y-3">
            <Alert variant="warning">
              <AlertDescription>{t(($) => $.walletProtectionUnsecuredWarning)}</AlertDescription>
            </Alert>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={unsecuredConfirmed}
                id={unsecuredConfirmId}
                onCheckedChange={(checked) => onUnsecuredConfirmedChange(checked === true)}
              />
              <Label htmlFor={unsecuredConfirmId}>{t(($) => $.walletProtectionUnsecuredConfirm)}</Label>
            </div>
          </div>
        ) : null}
      </div>
    </details>
  )
}
