import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'

import type { ClusterWallet } from './portfolio-routes-loaded.js'

import { PortfolioFeatureTabActivity } from './portfolio-feature-tab-activity.js'
import { PortfolioFeatureTabTokens } from './portfolio-feature-tab-tokens.js'

export function PortfolioFeatureIndex(props: ClusterWallet) {
  return (
    <UiTabRoutes
      basePath="/portfolio"
      className="items-center my-6"
      tabs={[
        { element: <PortfolioFeatureTabTokens {...props} />, label: 'Tokens', path: 'tokens' },
        { element: <PortfolioFeatureTabActivity {...props} />, label: 'Activity', path: 'activity' },
      ]}
    />
  )
}
