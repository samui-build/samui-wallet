import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useRoutes } from 'react-router'

import { PortfolioFeatureIndex } from './portfolio-feature-index.js'
import { PortfolioFeatureTx } from './portfolio-feature-tx.js'

export interface ClusterWallet {
  cluster: Cluster
  wallet: Wallet
}

export function PortfolioRoutesLoaded(props: ClusterWallet) {
  return useRoutes([
    { element: <PortfolioFeatureIndex {...props} />, path: '*' },
    { element: <PortfolioFeatureTx {...props} />, path: 'tx/:signature' },
    // { element: <div>Page not found :(</div>, path: '*' },
  ])
}
