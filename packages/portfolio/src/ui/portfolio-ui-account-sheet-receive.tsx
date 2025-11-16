import type { Account } from '@workspace/db/entity/account'

import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiQrCode } from '@workspace/ui/components/ui-qr-code'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function PortfolioUiAccountSheetReceive({ account }: { account: Account }) {
  return (
    <UiBottomSheet
      description="Receive assets by sending them to this public key"
      title="Receive assets"
      trigger={
        <Button variant="secondary">
          <UiIcon icon="arrowDown" /> Receive
        </Button>
      }
    >
      <Button
        onClick={async () => {
          try {
            await handleCopyText(account.publicKey)
            toastSuccess('Copied Public Key')
          } catch (error) {
            toastError(error instanceof Error ? error.message : 'Failed to copy public key')
          }
        }}
        variant="outline"
      >
        <UiIcon icon="copy" />
        Copy Public Key
      </Button>
      <div className="px-6">
        <UiQrCode content={account.publicKey} />
      </div>
    </UiBottomSheet>
  )
}
