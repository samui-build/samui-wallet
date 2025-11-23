import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
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
  account: Account
  network: Network
}) {
  return account ? (
    <div className="gap-2 flex justify-center">
      <PortfolioUiAccountSheetReceive account={account} />
      <PortfolioUiAccountSheetSend balances={balances} isLoading={isLoading} send={send} />
    </div>
  ) : null
}
