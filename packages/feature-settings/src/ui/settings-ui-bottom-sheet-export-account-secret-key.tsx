import type { Account } from '@workspace/db/account/account'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { toastError } from '@workspace/ui/lib/toast-error'
import { useVaultUnlockDialog } from '@workspace/vault-react/vault-unlock-provider'
import { useRef, useState } from 'react'
import { SettingsUiExportConfirm } from './settings-ui-export-confirm.tsx'
import { SettingsUiMnemonicBlur } from './settings-ui-mnemonic-blur.tsx'

export function SettingsUiBottomSheetExportAccountSecretKey({
  account,
  open,
  setOpen,
}: {
  account: Account
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('settings')
  const { requestUnlock } = useVaultUnlockDialog()
  const sessionRef = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const [secretKey, setSecretKey] = useState<string>()
  const wallet = useWalletFindUnique({ id: account.walletId })
  const readSecretKeyMutation = useAccountReadSecretKey()

  function handleOpenChange(value: boolean) {
    if (!value) {
      sessionRef.current += 1
      readSecretKeyMutation.reset()
      setRevealed(false)
      setSecretKey(undefined)
    }
    setOpen(value)
  }

  async function handleShowSecretKey() {
    const session = sessionRef.current
    if (!wallet) {
      toastError('Wallet not found')
      return
    }

    const unlocked = await requestUnlock({
      mode: wallet.protectionMode,
      reason: 'exportAccountSecretKey',
      walletId: wallet.id,
    })
    if (!unlocked) {
      return
    }
    if (session !== sessionRef.current) {
      return
    }

    try {
      const result = await readSecretKeyMutation.mutateAsync({ id: account.id })
      if (session === sessionRef.current) {
        setSecretKey(result)
      }
    } catch (caught) {
      if (session === sessionRef.current) {
        toastError(caught instanceof Error ? caught.message : `${caught}`)
      }
    }
  }

  return (
    <UiBottomSheet
      description={t(($) => $.exportSecretKeyCopyConfirmDescription)}
      onOpenChange={handleOpenChange}
      open={open}
      title={t(($) => $.exportSecretKeyCopyConfirmTitle)}
    >
      <div className="px-4 pb-4">
        {secretKey?.length ? (
          <div className="space-y-2 text-center">
            <SettingsUiMnemonicBlur revealed={revealed} value={secretKey} />
            <div className="space-x-2">
              <Button onClick={() => setRevealed((val) => !val)} variant="secondary">
                <UiIcon icon="watch" />
                {revealed ? t(($) => $.exportSecretKeyHide) : t(($) => $.exportSecretKeyReveal)}
              </Button>
              <UiTextCopyButton
                label={t(($) => $.exportSecretKeyCopy)}
                text={secretKey}
                toast={t(($) => $.exportSecretKeyCopyCopied)}
              />
            </div>
          </div>
        ) : (
          <SettingsUiExportConfirm confirm={handleShowSecretKey} label={t(($) => $.exportSecretKeyShow)} />
        )}
      </div>
    </UiBottomSheet>
  )
}
