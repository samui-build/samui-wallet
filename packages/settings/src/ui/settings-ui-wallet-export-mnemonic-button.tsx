import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function SettingsUiWalletExportMnemonicButton({ wallet }: { wallet: Wallet }) {
  const { t } = useTranslation('settings')
  async function exportMnemonic() {
    try {
      await handleCopyText(wallet.mnemonic)
      toastSuccess('Mnemonic copied to clipboard')
    } catch {
      window.prompt('Copy your mnemonic from this dialog:', wallet.mnemonic)
      toastError('Clipboard copy blocked. Mnemonic shown for manual copy.')
    }
  }

  return (
    <UiTooltip content={t(($) => $.actionExportMnemonic)}>
      <UiConfirm
        action={exportMnemonic}
        actionLabel="Export"
        description="Do you want to copy it to your clipboard?"
        title="Exporting the mnemonic reveals sensitive information."
      >
        <Button size="icon" variant="outline">
          <UiIcon className="size-4" icon="mnemonic" />
        </Button>
      </UiConfirm>
    </UiTooltip>
  )
}
