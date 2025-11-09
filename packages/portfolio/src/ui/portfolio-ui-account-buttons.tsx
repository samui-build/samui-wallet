import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import type { AccountNetwork } from '../portfolio-routes-loaded.tsx'

import { PortfolioUiAccountSheetReceive } from './portfolio-ui-account-sheet-receive.tsx'
import { PortfolioUiAccountSheetSend } from './portfolio-ui-account-sheet-send.tsx'

export function PortfolioUiAccountButtons({
  account,
  balances,
  isLoading,
  send,
}: {
  balances: TokenBalance[]
  isLoading: boolean
  send: (input: { amount: string; destination: string; mint: TokenBalance }) => Promise<void>
} & AccountNetwork) {
  return account ? (
    <div className="gap-2 flex justify-center">
      <PortfolioUiAccountSheetReceive account={account} />
      <PortfolioUiAccountSheetSend balances={balances} isLoading={isLoading} send={send} />
    </div>
  ) : null
}
