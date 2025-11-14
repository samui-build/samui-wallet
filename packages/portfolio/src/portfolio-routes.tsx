import { UiPage } from '@workspace/ui/components/ui-page'
import { PortfolioRoutesLoaded } from './portfolio-routes-loaded.tsx'
import { PortfolioUiAccountGuard } from './ui/portfolio-ui-account-guard.tsx'
import { PortfolioUiNetworkGuard } from './ui/portfolio-ui-network-guard.tsx'

export default function PortfolioRoutes() {
  return (
    <UiPage containerProps={{ className: 'sm:max-w-2xl' }}>
      <PortfolioUiNetworkGuard
        render={({ network }) => (
          <PortfolioUiAccountGuard
            render={({ account }) => {
              return <PortfolioRoutesLoaded account={account} network={network} />
            }}
          />
        )}
      />
    </UiPage>
  )
}
