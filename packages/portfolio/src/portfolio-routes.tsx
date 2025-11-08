import { PortfolioRoutesLoaded } from './portfolio-routes-loaded.tsx'
import { PortfolioUiNetworkGuard } from './ui/portfolio-ui-network-guard.tsx'
import { PortfolioUiWalletGuard } from './ui/portfolio-ui-wallet-guard.tsx'

export default function PortfolioRoutes() {
  return (
    <PortfolioUiNetworkGuard
      render={({ network }) => (
        <PortfolioUiWalletGuard
          render={({ wallet }) => {
            return <PortfolioRoutesLoaded network={network} wallet={wallet} />
          }}
        />
      )}
    />
  )
}
