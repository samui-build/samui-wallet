import type { Address } from '@solana/kit'
import type { FetchedAccount } from '@workspace/solana-client/fetch-account'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountInfoTokenMint({
  basePath,
  account,
}: {
  basePath: string
  account: FetchedAccount
}) {
  // @ts-expect-error typing
  const mintAuthority: Address = account.data?.mintAuthority
  // @ts-expect-error typing
  const freezeAuthority: Address = account.data?.freezeAuthority
  // @ts-expect-error typing
  const mintDecimals: Address = account.data?.decimals
  // @ts-expect-error typing
  const mintSupply: Address = account.data?.supply

  return (
    <ExplorerUiDetailGrid cols={2}>
      <ExplorerUiDetailRow label="Supply" value={mintSupply} />
      <ExplorerUiDetailRow label="Decimals" value={mintDecimals} />
      <ExplorerUiDetailRow
        label="Mint Authority"
        value={mintAuthority ? <ExplorerUiLinkAddress address={mintAuthority} basePath={basePath} /> : 'None'}
      />
      <ExplorerUiDetailRow
        label="Freeze Authority"
        value={freezeAuthority ? <ExplorerUiLinkAddress address={freezeAuthority} basePath={basePath} /> : 'None'}
      />
    </ExplorerUiDetailGrid>
  )
}
