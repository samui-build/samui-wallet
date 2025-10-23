import type { ClusterWallet } from './portfolio-routes-loaded.js'

import { PortfolioFeatureGetSolBalance } from './portfolio-feature-get-sol-balance.js'
import { PortfolioFeatureGetTokenAccounts } from './portfolio-feature-get-token-accounts.js'
import { PortfolioUiWalletButtons } from './ui/portfolio-ui-wallet-buttons.js'

export function PortfolioFeatureTabTokens(props: ClusterWallet) {
  return (
    <div className="p-4 space-y-6">
      <PortfolioFeatureGetSolBalance {...props} />
      <PortfolioUiWalletButtons {...props} />
      <PortfolioFeatureGetTokenAccounts {...props} />
    </div>
  )
}
