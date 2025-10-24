import type { TokenBalance } from '../data-access/use-get-token-metadata.js'
import type { ClusterWallet } from '../portfolio-routes-loaded.js'

import { PortfolioUiWalletSheetReceive } from './portfolio-ui-wallet-sheet-receive.js'
import { PortfolioUiWalletSheetSend } from './portfolio-ui-wallet-sheet-send.js'

export function PortfolioUiWalletButtons({
  balances,
  send,
  wallet,
}: {
  balances: TokenBalance[]
  send: (input: { amount: string; destination: string; mint: TokenBalance }) => Promise<void>
} & ClusterWallet) {
  return wallet ? (
    <div className="gap-2 flex justify-center">
      <PortfolioUiWalletSheetReceive wallet={wallet} />
      <PortfolioUiWalletSheetSend balances={balances} send={send} />
    </div>
  ) : null
}
