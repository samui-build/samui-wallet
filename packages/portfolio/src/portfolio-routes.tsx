import { PortfolioRoutesLoaded } from './portfolio-routes-loaded.tsx'
import { PortfolioUiClusterGuard } from './ui/portfolio-ui-cluster-guard.tsx'
import { PortfolioUiWalletGuard } from './ui/portfolio-ui-wallet-guard.tsx'

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
