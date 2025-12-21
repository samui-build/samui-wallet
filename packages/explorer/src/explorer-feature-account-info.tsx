import { useTranslation } from '@workspace/i18n'
import type { AccountInfoWithParsedData } from '@workspace/solana-client/get-account-info'
import { type AccountType, getAccountType } from '@workspace/solana-client/get-account-type'
import { Badge } from '@workspace/ui/components/badge'
import { ExplorerFeatureAccountInfoContent } from './explorer-feature-account-info-content.tsx'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountInfo({
  basePath,
  account,
}: {
  basePath: string
  account?: AccountInfoWithParsedData | undefined
}) {
  const { t } = useTranslation('explorer')
  const type: AccountType = getAccountType({ account })
  return (
    <ExplorerUiDetailGrid>
      <ExplorerUiDetailGrid cols={2}>
        <ExplorerUiDetailRow label="Account Type" value={<Badge variant="outline">{type}</Badge>} />
        <ExplorerUiDetailRow
          label={t(($) => $.owner)}
          value={account?.owner ? <ExplorerUiLinkAddress address={account.owner} basePath={basePath} /> : null}
        />
      </ExplorerUiDetailGrid>
      {account ? <ExplorerFeatureAccountInfoContent account={account} basePath={basePath} /> : null}
    </ExplorerUiDetailGrid>
  )
}
