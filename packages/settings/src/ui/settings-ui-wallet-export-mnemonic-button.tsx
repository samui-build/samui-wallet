import type { Wallet } from '@workspace/db/wallet/wallet'

import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import type { MouseEvent } from 'react'

export function SettingsUiWalletExportMnemonicButton({ wallet }: { wallet: Wallet }) {
  async function exportMnemonic(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    const confirmed = window.confirm(
      'Exporting the mnemonic reveals sensitive information. Do you want to copy it to your clipboard?',
    )

    if (!confirmed) {
      return
    }

    try {
      await handleCopyText(wallet.mnemonic)
      toastSuccess('Mnemonic copied to clipboard')
    } catch {
      window.prompt('Copy your mnemonic from this dialog:', wallet.mnemonic)
      toastError('Clipboard copy blocked. Mnemonic shown for manual copy.')
    }
  }

  return (
    <UiTooltip content="Export mnemonic">
      <Button onClick={exportMnemonic} size="icon" type="button" variant="outline">
        <UiIcon className="size-4" icon="mnemonic" />
      </Button>
    </UiTooltip>
  )
}
