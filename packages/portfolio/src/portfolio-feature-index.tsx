import type { ClusterWallet } from './portfolio-routes-loaded.js'

import { PortfolioFeatureGetActivity } from './portfolio-feature-get-activity.js'
import { PortfolioFeatureGetSolBalance } from './portfolio-feature-get-sol-balance.js'
import { PortfolioFeatureGetTokenAccounts } from './portfolio-feature-get-token-accounts.js'

export function PortfolioFeatureIndex(props: ClusterWallet) {
  return (
    <div className="p-4 space-y-6">
      <PortfolioFeatureGetSolBalance {...props} />
      <PortfolioFeatureGetTokenAccounts {...props} />
      <PortfolioFeatureGetActivity {...props} />
    </div>
  )
}
