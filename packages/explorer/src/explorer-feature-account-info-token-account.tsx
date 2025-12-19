import type { AccountTokenAccountInfo } from '@workspace/solana-client/get-account-token-info'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountInfoTokenAccount({
  basePath,
  extensions,
  mint,
  mintAmount,
  mintDecimals,
}: Omit<AccountTokenAccountInfo, 'type'> & {
  basePath: string
}) {
  return (
    <ExplorerUiDetailGrid>
      <ExplorerUiDetailGrid cols={2}>
        <ExplorerUiDetailRow label="Amount" value={mintAmount} />
        <ExplorerUiDetailRow label="Decimals" value={mintDecimals} />
        <ExplorerUiDetailRow label="Mint" value={<ExplorerUiLinkAddress address={mint} basePath={basePath} />} />
        <ExplorerUiDetailRow label="Extensions" value={extensions} />
      </ExplorerUiDetailGrid>
    </ExplorerUiDetailGrid>
  )
}
