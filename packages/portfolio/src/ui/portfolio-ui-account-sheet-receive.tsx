import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiQrCode } from '@workspace/ui/components/ui-qr-code'
import { useHandleCopyText } from '@workspace/ui/components/use-handle-copy-text'

export function PortfolioUiAccountSheetReceive({ account }: { account: Account }) {
  const { t } = useTranslation('portfolio')
  const { handleCopy } = useHandleCopyText({
    text: account.publicKey,
    toast: t(($) => $.actionCopyPublicKeySuccess),
    toastFailed: t(($) => $.actionCopyPublicKeyError),
  })

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
      <Button onClick={() => handleCopy()} variant="outline">
        <UiIcon icon="copy" />
        {t(($) => $.actionCopyPublicKey)}
      </Button>
      <div className="px-6">
        <UiQrCode content={account.publicKey} />
      </div>
    </UiBottomSheet>
  )
}
