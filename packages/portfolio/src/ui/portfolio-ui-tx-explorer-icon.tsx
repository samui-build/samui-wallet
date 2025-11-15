import type { Network } from '@workspace/db/entity/network'

import { PortfolioUiExplorerIcon } from './portfolio-ui-explorer-icon.tsx'

export function PortfolioUiTxExplorerIcon({ network, signature }: { network: Network; signature: string }) {
  return <PortfolioUiExplorerIcon network={network} path={`/tx/${signature}`} provider="solana" />
}
