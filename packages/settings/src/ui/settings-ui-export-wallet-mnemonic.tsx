import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Fragment, useState } from 'react'
import { SettingsUiExportWalletMnemonicSheet } from './settings-ui-export-wallet-mnemonic-sheet.tsx'

export function SettingsUiExportWalletMnemonic({ wallet }: { wallet: Wallet }) {
  const { t } = useTranslation('settings')
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <Button
        onClick={() => setOpen((value) => !value)}
        size="icon"
        title={t(($) => $.exportMnemonicCopy)}
        variant="outline"
      >
        <UiIcon className="size-4" icon="mnemonic" />
      </Button>
      <SettingsUiExportWalletMnemonicSheet open={open} setOpen={setOpen} wallet={wallet} />
    </Fragment>
  )
}
