import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'
import { PortfolioFeatureTabActivity } from './portfolio-feature-tab-activity.tsx'
import { PortfolioFeatureTabTokens } from './portfolio-feature-tab-tokens.tsx'
import type { AccountNetwork } from './portfolio-routes-loaded.tsx'

export function PortfolioFeatureIndex(props: AccountNetwork) {
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
