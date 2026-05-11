import type { Wallet } from '@workspace/db/wallet/wallet'
import { useWalletReadMnemonic } from '@workspace/db-react/use-wallet-read-mnemonic'
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

export function SettingsUiBottomSheetExportWalletMnemonic({
  wallet,
  open,
  setOpen,
}: {
  wallet: Wallet
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('settings')
  const { requestUnlock } = useVaultUnlockDialog()
  const sessionRef = useRef(0)
  const [mnemonic, setMnemonic] = useState<string>()
  const [revealed, setRevealed] = useState(false)
  const readMnemonicMutation = useWalletReadMnemonic()

  function handleOpenChange(value: boolean) {
    if (!value) {
      sessionRef.current += 1
      readMnemonicMutation.reset()
      setMnemonic(undefined)
      setRevealed(false)
    }
    setOpen(value)
  }

  async function handleShowMnemonic() {
    const session = sessionRef.current
    const unlocked = await requestUnlock({
      mode: wallet.protectionMode,
      reason: 'exportWalletMnemonic',
      walletId: wallet.id,
    })
    if (!unlocked) {
      return
    }
    if (session !== sessionRef.current) {
      return
    }

    try {
      const result = await readMnemonicMutation.mutateAsync({ id: wallet.id })
      if (session === sessionRef.current) {
        setMnemonic(result)
      }
    } catch (caught) {
      if (session === sessionRef.current) {
        toastError(caught instanceof Error ? caught.message : `${caught}`)
      }
    }
  }

  return (
    <UiBottomSheet
      description={t(($) => $.exportMnemonicCopyConfirmDescription)}
      onOpenChange={handleOpenChange}
      open={open}
      title={t(($) => $.exportMnemonicCopyConfirmTitle)}
    >
      <div className="px-4 pb-4">
        {mnemonic?.length ? (
          <div className="space-y-2 text-center">
            <SettingsUiMnemonicBlur revealed={revealed} value={mnemonic} />
            <div className="space-x-2">
              <Button onClick={() => setRevealed((val) => !val)} variant="secondary">
                <UiIcon icon="watch" />
                {revealed ? t(($) => $.exportMnemonicHide) : t(($) => $.exportMnemonicReveal)}
              </Button>
              <UiTextCopyButton
                label={t(($) => $.exportMnemonicCopy)}
                text={mnemonic}
                toast={t(($) => $.exportMnemonicCopyCopied)}
              />
            </div>
          </div>
        ) : (
          <SettingsUiExportConfirm confirm={handleShowMnemonic} label={t(($) => $.exportMnemonicShow)} />
        )}
      </div>
    </UiBottomSheet>
  )
}
