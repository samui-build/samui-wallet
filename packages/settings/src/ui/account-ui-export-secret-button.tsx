import type { Account } from '@workspace/db/entity/account'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function AccountExportSecretButton({ account }: { account: Account }) {
  if (!account.secretKey) {
    return (
      <UiTooltip content="Secret key is not available for this account">
        <Button disabled size="icon" type="button" variant="outline">
          <UiIcon className="size-4" icon="key" />
        </Button>
      </UiTooltip>
    )
  }

  async function exportSecret() {
    const confirmed = window.confirm(
      'Exporting the secret key reveals sensitive information. Do you want to copy it to your clipboard?',
    )
    if (!confirmed) {
      return
    }
    try {
      await handleCopyText(account.secretKey as string)
      toastSuccess('Secret key copied to clipboard')
    } catch {
      window.prompt('Copy your secret key from this dialog:', account.secretKey)
      toastError('Clipboard copy blocked. Secret key shown for manual copy.')
    }
  }

  return (
    <UiTooltip content="Copy secret key to clipboard">
      <Button onClick={exportSecret} size="icon" type="button" variant="outline">
        <UiIcon className="size-4" icon="key" />
      </Button>
    </UiTooltip>
  )
}
