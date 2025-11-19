import { UiPage } from '@workspace/ui/components/ui-page'
import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'
import { PortfolioFeatureTabActivity } from './portfolio-feature-tab-activity.tsx'
import { PortfolioFeatureTabTokens } from './portfolio-feature-tab-tokens.tsx'

export default function PortfolioRoutes() {
  return (
    <UiPage className="lg:max-w-2xl md:max-w-2xl sm:max-w-2xl xl:max-w-2xl">
      <UiTabRoutes
        basePath="/portfolio"
        className="items-center mb-4 lg:mb-6"
        tabs={[
          { element: <PortfolioFeatureTabTokens />, label: 'Tokens', path: 'tokens' },
          { element: <PortfolioFeatureTabActivity />, label: 'Activity', path: 'activity' },
        ]}
      />
    </UiPage>
  )
}
