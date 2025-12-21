import type { Address } from '@solana/kit'
import type { AccountInfoWithParsedData } from '@workspace/solana-client/get-account-info'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountInfoTokenMint({
  basePath,
  accountData,
}: {
  basePath: string
  accountData: AccountInfoWithParsedData['data']
}) {
  // @ts-expect-error typing
  const mintAuthority: Address = accountData.parsed.info?.mintAuthority
  // @ts-expect-error typing
  const freezeAuthority: Address = accountData.parsed.info?.freezeAuthority
  // @ts-expect-error typing
  const mintDecimals: Address = accountData.parsed.info?.decimals
  // @ts-expect-error typing
  const mintSupply: Address = accountData.parsed.info?.supply

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
