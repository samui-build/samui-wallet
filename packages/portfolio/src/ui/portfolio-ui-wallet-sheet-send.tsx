import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { LucideArrowUp } from 'lucide-react'

import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'

import { PortfolioUiWalletFormSend } from './portfolio-ui-wallet-form-send.tsx'

export function PortfolioUiWalletSheetSend({
  balances,
  isLoading,
  send,
}: {
  balances: TokenBalance[]
  isLoading: boolean
  send: (input: { amount: string; destination: string; mint: TokenBalance }) => Promise<void>
}) {
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
      <PortfolioUiWalletFormSend balances={balances} isLoading={isLoading} send={send} />
    </UiBottomSheet>
  )
}
