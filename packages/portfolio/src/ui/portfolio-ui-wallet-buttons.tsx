import type { ClusterWallet } from '../portfolio-routes-loaded.js'

import { PortfolioUiWalletSheetReceive } from './portfolio-ui-wallet-sheet-receive.js'
import { PortfolioUiWalletSheetSend } from './portfolio-ui-wallet-sheet-send.js'

export function PortfolioUiWalletButtons({ wallet }: ClusterWallet) {
  return wallet ? (
    <div className="gap-2 flex justify-center">
      <PortfolioUiWalletSheetReceive wallet={wallet} />
      <PortfolioUiWalletSheetSend />
    </div>
  ) : null
}
