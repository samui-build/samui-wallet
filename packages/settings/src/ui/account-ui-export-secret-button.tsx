import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function AccountExportSecretButton({ account }: { account: Account }) {
  const { t } = useTranslation('settings')
  if (!account.secretKey) {
    return (
      <UiTooltip content={t(($) => $.accountNoSecretKey)}>
        <Button disabled size="icon" type="button" variant="outline">
          <UiIcon className="size-4" icon="key" />
        </Button>
      </UiTooltip>
    )
  }

  async function exportSecret() {
    if (!window.confirm(t(($) => $.accountCopySecretKeyConfirm))) {
      return
    }
    try {
      await handleCopyText(account.secretKey as string)
      toastSuccess(t(($) => $.accountCopySecretKeyCopied))
    } catch {
      window.prompt(
        t(($) => $.accountCopySecretKeyDialog),
        account.secretKey,
      )
      toastError(t(($) => $.accountCopySecretKeyBlocked))
    }
  }

  return (
    <UiTooltip content={t(($) => $.accountCopySecretKey)}>
      <Button onClick={exportSecret} size="icon" type="button" variant="outline">
        <UiIcon className="size-4" icon="key" />
      </Button>
    </UiTooltip>
  )
}
