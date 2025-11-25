import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiQrCode } from '@workspace/ui/components/ui-qr-code'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'

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
      <div className="space-y-6 p-2 text-center md:pb-10">
        <UiTextCopyButton
          label={t(($) => $.actionCopyPublicKey)}
          text={account.publicKey}
          toast={t(($) => $.actionCopyPublicKeySuccess)}
          toastFailed={t(($) => $.actionCopyPublicKeyError)}
        />
        <div className="flex size-85 w-full justify-center">
          <div className="aspect-square">
            <UiQrCode content={account.publicKey} />
          </div>
        </div>
      </div>
    </UiBottomSheet>
  )
}
