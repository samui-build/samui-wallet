// cspell:words Reprotect reprotect

import type { Account } from '@workspace/db/account/account'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useAccountDelete } from '@workspace/db-react/use-account-delete'
import { useAccountUpdateOrder } from '@workspace/db-react/use-account-update-order'
import { useAccountsForWalletLive } from '@workspace/db-react/use-accounts-for-wallet-live'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { useTranslation } from '@workspace/i18n'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import {
  VAULT_PIN_MAX_LENGTH,
  VAULT_PIN_MIN_LENGTH,
  type WalletProtectionMode,
} from '@workspace/vault/encrypted-value-schema'
import { useWalletReprotect } from '@workspace/vault-react/use-wallet-reprotect'
import { useWalletUnlock } from '@workspace/vault-react/use-wallet-unlock'
import { useVaultUnlockDialog } from '@workspace/vault-react/vault-unlock-provider'
import type { SyntheticEvent } from 'react'
import { useId, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { SettingsUiAccountList } from './ui/settings-ui-account-list.tsx'
import { SettingsUiWalletItem } from './ui/settings-ui-wallet-item.tsx'

type ProtectionModeLabels = Record<WalletProtectionMode, string>

type WalletProtectionInput = { mode: 'password' } | { mode: 'pin'; pin: string } | { mode: 'unsecured' }

type WalletProtectionValidationMessages = {
  pinLength: string
  pinMismatch: string
  unsecuredConfirm: string
}

export function SettingsFeatureWalletDetails() {
  const { t } = useTranslation('settings')
  const pinConfirmId = useId()
  const pinId = useId()
  const protectionId = useId()
  const unsecuredConfirmId = useId()
  const { pathname: from } = useLocation()
  const { requestUnlock } = useVaultUnlockDialog()
  const { walletId } = useParams<{ walletId: string }>()
  if (!walletId) {
    throw new Error('Parameter walletId is required')
  }
  const resolvedWalletId = walletId

  const deleteMutation = useAccountDelete({
    onError: (error) => toastError(error.message),
    onSuccess: () => toastSuccess('Account deleted'),
  })
  const updateOrderMutation = useAccountUpdateOrder({
    onError: (error) => toastError(error.message),
    onSuccess: () => toastSuccess('Account order updated'),
  })
  const activeAccount = useAccountActive()
  const wallet = useWalletFindUnique({ id: resolvedWalletId })
  const accounts = useAccountsForWalletLive({ walletId: resolvedWalletId })
  const activeNetwork = useNetworkActive()
  const requestAirdropMutation = useRequestAirdrop(activeNetwork)
  const currentProtectionMode = wallet?.protectionMode ?? 'password'
  const protectionModeLabels: ProtectionModeLabels = {
    password: t(($) => $.walletProtectionPassword),
    pin: t(($) => $.walletProtectionPin),
    unsecured: t(($) => $.walletProtectionUnsecured),
  }
  const validationMessages: WalletProtectionValidationMessages = {
    pinLength: t(($) => $.walletProtectionPinLengthError, {
      max: VAULT_PIN_MAX_LENGTH,
      min: VAULT_PIN_MIN_LENGTH,
    }),
    pinMismatch: t(($) => $.walletProtectionPinMismatchError),
    unsecuredConfirm: t(($) => $.walletProtectionUnsecuredConfirmError),
  }
  const [protectionDraft, setProtectionDraft] = useState<ProtectionDraft>(() =>
    createProtectionDraft(resolvedWalletId, currentProtectionMode),
  )
  const draft =
    protectionDraft.sourceMode === currentProtectionMode && protectionDraft.walletId === resolvedWalletId
      ? protectionDraft
      : createProtectionDraft(resolvedWalletId, currentProtectionMode)
  const { unsecuredConfirmed, pin, pinConfirm, selectedMode: selectedProtectionMode } = draft
  const reprotectMutation = useWalletReprotect({
    onError: (caught) => toastError(caught.message),
    onSuccess: () => toastSuccess(t(($) => $.walletProtectionActionSave)),
  })
  const unlockWalletMutation = useWalletUnlock({
    onError: (caught) => toastError(caught.message),
  })

  if (!wallet) {
    return <UiNotFound />
  }

  function handleMove(item: Account, adjustment: number) {
    return updateOrderMutation.mutateAsync({ input: { id: item.id, order: item.order + adjustment } })
  }

  function handleProtectionModeChange(value: string) {
    if (!value) {
      return
    }
    setProtectionDraft({
      ...draft,
      pin: '',
      pinConfirm: '',
      selectedMode: parseWalletProtectionModeValue(value),
      unsecuredConfirmed: false,
    })
  }

  async function handleProtectionSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    let protection: ReturnType<typeof getWalletProtectionInput>
    try {
      protection = getWalletProtectionInput({
        pin,
        pinConfirm,
        protectionMode: selectedProtectionMode,
        unsecuredConfirmed,
        validationMessages,
      })
    } catch (caught) {
      toastError(caught instanceof Error ? caught.message : `${caught}`)
      return
    }

    const unlocked = await requestUnlock({
      mode: currentProtectionMode,
      reason: 'walletProtection',
      walletId: resolvedWalletId,
    })
    if (!unlocked) {
      return
    }

    const result = await reprotectMutation.mutateAsync({ protection, walletId: resolvedWalletId }).catch(() => null)
    if (result === null) {
      return
    }
    if (protection.mode === 'pin') {
      await unlockWalletMutation
        .mutateAsync({ credential: protection.pin, walletId: resolvedWalletId })
        .catch(() => undefined)
    }
    setProtectionDraft(createProtectionDraft(resolvedWalletId, protection.mode))
  }

  const hasProtectionChange = selectedProtectionMode !== currentProtectionMode
  const isProtectionBusy = reprotectMutation.isPending || unlockWalletMutation.isPending

  return (
    <UiCard
      backButtonTo="/settings/wallets"
      title={
        <div className="flex w-full items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-2">
            <SettingsUiWalletItem item={wallet} />
            <Button asChild size="icon" title={t(($) => $.actionEditWallet)} variant="ghost">
              <Link state={{ from }} to={`./edit`}>
                <UiIcon className="size-4" icon="edit" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild title={t(($) => $.actionEditWalletMessage)} variant="outline">
              <Link to={`./add`}>
                <UiIcon className="size-4" icon="add" />
                {t(($) => $.actionAddAccount)}
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <form className="space-y-4 border-b pb-6" onSubmit={handleProtectionSubmit}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-medium">{t(($) => $.walletProtectionTitle)}</div>
            <div className="text-muted-foreground text-sm">
              {t(($) => $.walletProtectionCurrentLabel)}:{' '}
              {getProtectionModeLabel(currentProtectionMode, protectionModeLabels)}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={protectionId}>{t(($) => $.walletProtectionTitle)}</Label>
            <ToggleGroup
              className="grid w-full grid-cols-1 sm:grid-cols-3"
              id={protectionId}
              onValueChange={handleProtectionModeChange}
              type="single"
              value={selectedProtectionMode}
              variant="outline"
            >
              <ToggleGroupItem
                className="h-auto min-h-9 whitespace-normal px-3 py-2 text-center leading-snug"
                value="password"
              >
                {t(($) => $.walletProtectionPassword)}
              </ToggleGroupItem>
              <ToggleGroupItem
                className="h-auto min-h-9 whitespace-normal px-3 py-2 text-center leading-snug"
                value="pin"
              >
                {t(($) => $.walletProtectionPin)}
              </ToggleGroupItem>
              <ToggleGroupItem
                className="h-auto min-h-9 whitespace-normal px-3 py-2 text-center leading-snug"
                value="unsecured"
              >
                {t(($) => $.walletProtectionUnsecured)}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {selectedProtectionMode === 'pin' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={pinId}>{t(($) => $.walletProtectionPinLabel)}</Label>
                <Input
                  autoComplete="off"
                  id={pinId}
                  inputMode="numeric"
                  maxLength={VAULT_PIN_MAX_LENGTH}
                  minLength={VAULT_PIN_MIN_LENGTH}
                  onChange={(event) => setProtectionDraft({ ...draft, pin: event.target.value })}
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
                  onChange={(event) => setProtectionDraft({ ...draft, pinConfirm: event.target.value })}
                  pattern="[0-9]*"
                  type="password"
                  value={pinConfirm}
                />
              </div>
            </div>
          ) : null}
          {selectedProtectionMode === 'unsecured' ? (
            <div className="space-y-3">
              <Alert variant="warning">
                <AlertDescription>{t(($) => $.walletProtectionUnsecuredWarning)}</AlertDescription>
              </Alert>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={unsecuredConfirmed}
                  id={unsecuredConfirmId}
                  onCheckedChange={(checked) => setProtectionDraft({ ...draft, unsecuredConfirmed: checked === true })}
                />
                <Label htmlFor={unsecuredConfirmId}>{t(($) => $.walletProtectionUnsecuredConfirm)}</Label>
              </div>
            </div>
          ) : null}
          <Button disabled={isProtectionBusy || !hasProtectionChange} type="submit">
            {t(($) => $.walletProtectionActionSave)}
          </Button>
        </form>

        <SettingsUiAccountList
          activeId={activeAccount.id}
          deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
          items={accounts}
          networkType={activeNetwork.type}
          onMoveDown={(item: Account) => handleMove(item, 1)}
          onMoveUp={(item: Account) => handleMove(item, -1)}
          requestAirdrop={async (item) => {
            await requestAirdropMutation.mutateAsync({ address: item.publicKey, amount: solToLamports('1') })
          }}
        />
      </div>
    </UiCard>
  )
}

function getWalletProtectionInput(input: {
  unsecuredConfirmed: boolean
  pin: string
  pinConfirm: string
  protectionMode: WalletProtectionMode
  validationMessages: WalletProtectionValidationMessages
}): WalletProtectionInput {
  switch (input.protectionMode) {
    case 'password':
      return { mode: 'password' }
    case 'pin':
      if (!new RegExp(`^\\d{${VAULT_PIN_MIN_LENGTH},${VAULT_PIN_MAX_LENGTH}}$`).test(input.pin)) {
        throw new Error(input.validationMessages.pinLength)
      }
      if (input.pin !== input.pinConfirm) {
        throw new Error(input.validationMessages.pinMismatch)
      }
      return { mode: 'pin', pin: input.pin }
    case 'unsecured':
      if (!input.unsecuredConfirmed) {
        throw new Error(input.validationMessages.unsecuredConfirm)
      }
      return { mode: 'unsecured' }
  }
}

type ProtectionDraft = {
  unsecuredConfirmed: boolean
  pin: string
  pinConfirm: string
  selectedMode: WalletProtectionMode
  sourceMode: WalletProtectionMode
  walletId: string
}

function createProtectionDraft(walletId: string, mode: WalletProtectionMode): ProtectionDraft {
  return {
    pin: '',
    pinConfirm: '',
    selectedMode: mode,
    sourceMode: mode,
    unsecuredConfirmed: false,
    walletId,
  }
}

function getProtectionModeLabel(mode: WalletProtectionMode, labels: ProtectionModeLabels): string {
  return labels[mode]
}

function parseWalletProtectionModeValue(value: string): WalletProtectionMode {
  switch (value) {
    case 'pin':
    case 'unsecured':
      return value
    default:
      return 'password'
  }
}
