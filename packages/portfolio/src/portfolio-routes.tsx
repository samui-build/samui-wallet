import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useTranslation } from '@workspace/i18n'
import { UiPage } from '@workspace/ui/components/ui-page'
import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'
import { PortfolioFeatureTabActivity } from './portfolio-feature-tab-activity.tsx'
import { PortfolioFeatureTabTokens } from './portfolio-feature-tab-tokens.tsx'

export default function PortfolioRoutes() {
  const { t } = useTranslation('portfolio')
  const account = useAccountActive()
  const network = useNetworkActive()
  return (
    <UiPage className="sm:max-w-2xl md:max-w-2xl lg:max-w-2xl xl:max-w-2xl">
      <UiTabRoutes
        basePath="/portfolio"
        className="mb-4 items-center lg:mb-6"
        tabs={[
          {
            element: <PortfolioFeatureTabTokens address={account.publicKey} network={network} />,
            label: t(($) => $.labelTokens),
            path: 'tokens',
          },
          {
            element: <PortfolioFeatureTabActivity account={account} network={network} />,
            label: t(($) => $.labelActivity),
            path: 'activity',
          },
        ]}
      />
    </UiPage>
  )
}
