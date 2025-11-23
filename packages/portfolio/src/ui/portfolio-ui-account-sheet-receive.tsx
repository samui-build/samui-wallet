import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiQrCode } from '@workspace/ui/components/ui-qr-code'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function PortfolioUiAccountSheetReceive({ account }: { account: Account }) {
  const { t } = useTranslation('portfolio')
  return (
    <UiBottomSheet
      description={t(($) => $.pageReceiveDescription)}
      title={t(($) => $.pageReceiveTitle)}
      trigger={
        <Button variant="secondary">
          <UiIcon icon="arrowDown" /> {t(($) => $.actionReceive)}
        </Button>
      }
    >
      <Button
        onClick={async () => {
          try {
            await handleCopyText(account.publicKey)
            toastSuccess(t(($) => $.actionCopyPublicKeySuccess))
          } catch (error) {
            toastError(error instanceof Error ? error.message : t(($) => $.actionCopyPublicKeyError))
          }
        }}
        variant="outline"
      >
        <UiIcon icon="copy" />
        {t(($) => $.actionCopyPublicKey)}
      </Button>
      <div className="px-6">
        <UiQrCode content={account.publicKey} />
      </div>
    </UiBottomSheet>
  )
}
