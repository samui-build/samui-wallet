import { PortfolioRoutesLoaded } from './portfolio-routes-loaded.js'
import { PortfolioUiClusterGuard } from './ui/portfolio-ui-cluster-guard.js'
import { PortfolioUiWalletGuard } from './ui/portfolio-ui-wallet-guard.js'

export default function PortfolioRoutes() {
  return (
    <PortfolioUiClusterGuard
      render={({ cluster }) => (
        <PortfolioUiWalletGuard
          render={({ wallet }) => {
            return <PortfolioRoutesLoaded cluster={cluster} wallet={wallet} />
          }}
        />
      )}
    />
  )
}
