import { assertAccountExists } from '@solana/kit'
import type { FetchedAccount } from '@workspace/solana-client/fetch-account'
import { type AccountType, getAccountType } from '@workspace/solana-client/get-account-type'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { ExplorerFeatureAccountInfoTokenAccount } from './explorer-feature-account-info-token-account.tsx'
import { ExplorerFeatureAccountInfoTokenMint } from './explorer-feature-account-info-token-mint.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiError } from './ui/explorer-ui-error.tsx'

export function ExplorerFeatureAccountInfoContent({
  basePath,
  account,
}: {
  basePath: string
  account: FetchedAccount
}) {
  assertAccountExists(account)
  const type: AccountType = getAccountType(account)

  switch (type) {
    case 'token-account':
      return <ExplorerFeatureAccountInfoTokenAccount account={account} basePath={basePath} />
    case 'token-mint':
      return <ExplorerFeatureAccountInfoTokenMint account={account} basePath={basePath} />
    case 'token-unknown':
      return <ExplorerUiError message={`Unexpected type ${type}`} title="Unknown token type" />
    case 'system':
    case 'system-program':
      return null
    default:
      return <ExplorerUiDetailRow label="Unknown Account" value={<UiDebug data={account.data} />} />
  }
}
