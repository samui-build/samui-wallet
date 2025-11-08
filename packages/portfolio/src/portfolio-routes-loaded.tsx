import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'

import { useRoutes } from 'react-router'

import { PortfolioFeatureIndex } from './portfolio-feature-index.tsx'
import { PortfolioFeatureTx } from './portfolio-feature-tx.tsx'

export interface AccountNetwork {
  account: Account
  network: Network
}

export function PortfolioRoutesLoaded(props: AccountNetwork) {
  return useRoutes([
    { element: <PortfolioFeatureIndex {...props} />, path: '*' },
    { element: <PortfolioFeatureTx {...props} />, path: 'tx/:signature' },
    // { element: <div>Page not found :(</div>, path: '*' },
  ])
}
