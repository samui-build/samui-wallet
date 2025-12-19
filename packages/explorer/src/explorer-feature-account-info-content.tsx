import type { AccountInfoWithParsedData } from '@workspace/solana-client/get-account-info'
import { type AccountType, getAccountType } from '@workspace/solana-client/get-account-type'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { ExplorerFeatureAccountInfoTokenAccount } from './explorer-feature-account-info-token-account.tsx'
import { ExplorerFeatureAccountInfoTokenMint } from './explorer-feature-account-info-token-mint.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureAccountInfoContent({
  basePath,
  account,
}: {
  basePath: string
  account: AccountInfoWithParsedData
}) {
  const type: AccountType = getAccountType({ account })

  switch (type) {
    case 'token-account':
      return <ExplorerFeatureAccountInfoTokenAccount accountData={account.data} basePath={basePath} />
    case 'token-mint':
      return <ExplorerFeatureAccountInfoTokenMint accountData={account.data} basePath={basePath} />
    case 'token-unknown':
      return <ExplorerUiErrorPage message={`Unexpected type ${type}`} title="Unknown token type" />
    case 'system':
    case 'system-program':
      return null
    default:
      return <ExplorerUiDetailRow label="Unknown Account" value={<UiDebug data={account.data} />} />
  }
}
