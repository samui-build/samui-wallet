import type { Wallet } from '@workspace/db/wallet/wallet'
import { useWalletReadMnemonic } from '@workspace/db-react/use-wallet-read-mnemonic'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { useState } from 'react'
import { SettingsUiExportConfirm } from './settings-ui-export-confirm.tsx'
import { SettingsUiMnemonicBlur } from './settings-ui-mnemonic-blur.tsx'

export function SettingsUiExportWalletMnemonic({ wallet }: { wallet: Wallet }) {
  const { t } = useTranslation('settings')
  const [revealed, setRevealed] = useState(false)
  const readMnemonicMutation = useWalletReadMnemonic()

  return (
    <UiBottomSheet
      description={t(($) => $.exportMnemonicCopyConfirmDescription)}
      title={t(($) => $.exportMnemonicCopyConfirmTitle)}
      trigger={
        <Button size="icon" title={t(($) => $.exportMnemonicCopy)} variant="outline">
          <UiIcon className="size-4" icon="mnemonic" />
        </Button>
      }
    >
      <div className="px-4 pb-4">
        {readMnemonicMutation.data?.length ? (
          <div className="space-y-2 text-center">
            <SettingsUiMnemonicBlur revealed={revealed} value={readMnemonicMutation.data} />
            <div className="space-x-2">
              <Button onClick={() => setRevealed((val) => !val)} variant="secondary">
                <UiIcon icon="watch" />
                {revealed ? t(($) => $.exportMnemonicHide) : t(($) => $.exportMnemonicReveal)}
              </Button>
              <UiTextCopyButton
                label={t(($) => $.exportMnemonicCopy)}
                text={readMnemonicMutation.data}
                toast={t(($) => $.exportMnemonicCopyCopied)}
              />
            </div>
          </div>
        ) : (
          <SettingsUiExportConfirm
            confirm={() => readMnemonicMutation.mutateAsync({ id: wallet.id })}
            label={t(($) => $.exportMnemonicShow)}
          />
        )}
      </div>
    </UiBottomSheet>
  )
}
