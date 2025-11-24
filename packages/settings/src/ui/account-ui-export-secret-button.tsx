import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function AccountExportSecretButton({ account }: { account: Account }) {
  const { t } = useTranslation('settings')
  if (!account.secretKey) {
    return (
      <Button disabled size="icon" title={t(($) => $.accountNoSecretKey)} type="button" variant="outline">
        <UiIcon className="size-4" icon="key" />
      </Button>
    )
  }

  async function exportSecret() {
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
    <UiConfirm
      action={exportSecret}
      actionLabel="Export"
      description={t(($) => $.accountCopySecretKeyConfirmDescription)}
      title={t(($) => $.accountCopySecretKeyConfirmTitle)}
    >
      <Button size="icon" title={t(($) => $.accountCopySecretKey)} variant="outline">
        <UiIcon className="size-4" icon="key" />
      </Button>
    </UiConfirm>
  )
}
