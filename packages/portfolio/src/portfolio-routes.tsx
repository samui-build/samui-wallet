import { useDbAccountActive } from '@workspace/db-react/use-db-account-active'
import { useDbNetworkActive } from '@workspace/db-react/use-db-network-active'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useRoutes } from 'react-router'
import { PortfolioFeatureIndex } from './portfolio-feature-index.tsx'
import { PortfolioFeatureTx } from './portfolio-feature-tx.tsx'

export default function PortfolioRoutes() {
  const account = useDbAccountActive()
  const network = useDbNetworkActive()
  const routes = useRoutes([
    { element: <PortfolioFeatureIndex account={account} network={network} />, path: '*' },
    { element: <PortfolioFeatureTx network={network} />, path: 'tx/:signature' },
    // { element: <div>Page not found :(</div>, path: '*' },
  ])

  return <UiPage className="lg:max-w-2xl md:max-w-2xl sm:max-w-2xl xl:max-w-2xl">{routes}</UiPage>
}
