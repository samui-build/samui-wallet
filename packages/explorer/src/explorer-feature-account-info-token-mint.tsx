import { useTranslation } from '@workspace/i18n'
import type { AccountTokenMintInfo } from '@workspace/solana-client/get-account-token-info'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountInfoTokenMint({
  basePath,
  freezeAuthority,
  mintAuthority,
  mintDecimals,
  mintSupply,
}: Omit<AccountTokenMintInfo, 'type'> & {
  basePath: string
}) {
  const { t } = useTranslation('explorer')

  return (
    <ExplorerUiDetailGrid cols={2}>
      <ExplorerUiDetailRow label={t(($) => $.supply)} value={mintSupply} />
      <ExplorerUiDetailRow label={t(($) => $.decimals)} value={mintDecimals} />
      <ExplorerUiDetailRow
        label={t(($) => $.mintAuthority)}
        value={
          mintAuthority ? <ExplorerUiLinkAddress address={mintAuthority} basePath={basePath} /> : t(($) => $.labelEmpty)
        }
      />
      <ExplorerUiDetailRow
        label={t(($) => $.freezeAuthority)}
        value={
          freezeAuthority ? (
            <ExplorerUiLinkAddress address={freezeAuthority} basePath={basePath} />
          ) : (
            t(($) => $.labelEmpty)
          )
        }
      />
    </ExplorerUiDetailGrid>
  )
}
