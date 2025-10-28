import type { Cluster } from '@workspace/db/entity/cluster'
import type { GetActivityItem } from '@workspace/solana-client/get-activity'

import { PortfolioUiExplorerIcon } from './portfolio-ui-explorer-icon.js'

export function PortfolioUiTxExplorer({ cluster, tx }: { cluster: Cluster; tx: GetActivityItem }) {
  return <PortfolioUiExplorerIcon cluster={cluster} path={`/tx/${tx.signature}`} />
}
