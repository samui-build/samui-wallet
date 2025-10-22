import type { ClusterWallet } from './portfolio-routes-loaded.js'

import { PortfolioFeatureGetActivity } from './portfolio-feature-get-activity.js'

export function PortfolioFeatureTabActivity(props: ClusterWallet) {
  return (
    <div className="p-4 space-y-6">
      <PortfolioFeatureGetActivity {...props} />
    </div>
  )
}
