import type { Cluster } from '@workspace/db/entity/cluster'

import { PortfolioUiExplorerIcon } from './portfolio-ui-explorer-icon.js'

export function PortfolioUiTxExplorerIcon({ cluster, signature }: { cluster: Cluster; signature: string }) {
  return <PortfolioUiExplorerIcon cluster={cluster} path={`/tx/${signature}`} />
}
