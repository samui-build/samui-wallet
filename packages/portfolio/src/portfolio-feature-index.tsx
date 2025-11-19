import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/entity/network'
import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'
import { PortfolioFeatureTabActivity } from './portfolio-feature-tab-activity.tsx'
import { PortfolioFeatureTabTokens } from './portfolio-feature-tab-tokens.tsx'

export function PortfolioFeatureIndex(props: { account: Account; network: Network }) {
  return (
    <UiTabRoutes
      basePath="/portfolio"
      className="items-center mb-4 lg:mb-6"
      tabs={[
        { element: <PortfolioFeatureTabTokens {...props} />, label: 'Tokens', path: 'tokens' },
        { element: <PortfolioFeatureTabActivity {...props} />, label: 'Activity', path: 'activity' },
      ]}
    />
  )
}
