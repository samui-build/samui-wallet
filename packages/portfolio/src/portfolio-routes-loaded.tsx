import type { Network } from '@workspace/db/entity/network'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useRoutes } from 'react-router'

import { PortfolioFeatureIndex } from './portfolio-feature-index.tsx'
import { PortfolioFeatureTx } from './portfolio-feature-tx.tsx'

export interface NetworkWallet {
  network: Network
  wallet: Wallet
}

export function PortfolioRoutesLoaded(props: NetworkWallet) {
  return useRoutes([
    { element: <PortfolioFeatureIndex {...props} />, path: '*' },
    { element: <PortfolioFeatureTx {...props} />, path: 'tx/:signature' },
    // { element: <div>Page not found :(</div>, path: '*' },
  ])
}
