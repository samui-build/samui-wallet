import type { Address } from '@solana/kit'
import type { AccountInfoWithParsedData } from '@workspace/solana-client/get-account-info'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountInfoTokenAccount({
  basePath,
  accountData,
}: {
  basePath: string
  accountData: AccountInfoWithParsedData['data']
}) {
  // @ts-expect-error typing
  const mint: Address = accountData.parsed.info?.mint
  // @ts-expect-error typing
  const mintDecimals: Address = accountData.parsed.info?.tokenAmount?.decimals
  // @ts-expect-error typing
  const mintAmount: Address = accountData.parsed.info?.tokenAmount?.uiAmount
  // @ts-expect-error typing
  const extensions: Address[] = accountData.parsed.info.extensions?.map(({ extension }) => extension)

  return (
    <ExplorerUiDetailGrid>
      <ExplorerUiDetailGrid cols={2}>
        <ExplorerUiDetailRow label="Amount" value={mintAmount} />
        <ExplorerUiDetailRow label="Decimals" value={mintDecimals} />
        <ExplorerUiDetailRow label="Mint" value={<ExplorerUiLinkAddress address={mint} basePath={basePath} />} />
        <ExplorerUiDetailRow label="Extensions" value={extensions.join(', ')} />
      </ExplorerUiDetailGrid>
    </ExplorerUiDetailGrid>
  )
}
