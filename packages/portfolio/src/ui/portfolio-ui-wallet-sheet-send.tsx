import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { LucideArrowUp } from 'lucide-react'

export function PortfolioUiWalletSheetSend() {
  return (
    <UiBottomSheet
      description="Selecting the token, enter the destination public key and the amount."
      title="Send assets"
      trigger={
        <Button variant="secondary">
          <LucideArrowUp /> Send
        </Button>
      }
    >
      <div>Placeholder for Send Form</div>
    </UiBottomSheet>
  )
}
