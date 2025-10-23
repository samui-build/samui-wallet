import type { Wallet } from '@workspace/db/entity/wallet'

import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiQrCode } from '@workspace/ui/components/ui-qr-code'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { LucideArrowDown, LucideCopyCheck } from 'lucide-react'

export function PortfolioUiWalletSheetReceive({ wallet }: { wallet: Wallet }) {
  return (
    <UiBottomSheet
      description="Receive assets by sending them to this public key"
      title="Receive assets"
      trigger={
        <Button variant="secondary">
          <LucideArrowDown /> Receive
        </Button>
      }
    >
      <Button
        onClick={() => {
          handleCopyText(wallet.publicKey)
          toastSuccess('Copied Public Key')
        }}
        variant="outline"
      >
        <LucideCopyCheck />
        Copy Public Key
      </Button>
      <div className="px-6">
        <UiQrCode content={wallet.publicKey} />
      </div>
    </UiBottomSheet>
  )
}
