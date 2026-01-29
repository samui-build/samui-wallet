import type { Address } from '@solana/kit'
import type { FetchedAccount } from '@workspace/solana-client/fetch-account'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountInfoTokenAccount({
  basePath,
  account,
}: {
  basePath: string
  account: FetchedAccount
}) {
  // @ts-expect-error typing
  const mint: Address = account.data.mint
  // @ts-expect-error typing
  const mintDecimals: Address = account.data?.tokenAmount?.decimals
  // @ts-expect-error typing
  const mintAmount: Address = account.data?.tokenAmount?.uiAmount
  // @ts-expect-error typing
  const extensions: Address[] = account.data.extensions?.map(({ extension }) => extension)

  return (
    <ExplorerUiDetailGrid>
      <ExplorerUiDetailGrid cols={2}>
        <ExplorerUiDetailRow label="Amount" value={mintAmount} />
        <ExplorerUiDetailRow label="Decimals" value={mintDecimals} />
        <ExplorerUiDetailRow label="Mint" value={<ExplorerUiLinkAddress address={mint} basePath={basePath} />} />
        <ExplorerUiDetailRow label="Extensions" value={extensions?.join(', ')} />
      </ExplorerUiDetailGrid>
    </ExplorerUiDetailGrid>
  )
}
