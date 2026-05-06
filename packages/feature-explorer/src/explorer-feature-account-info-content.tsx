import { useTranslation } from '@workspace/i18n'
import type { ExistingFetchedAccount } from '@workspace/solana-client/fetch-account'
import { getAccountTokenInfo } from '@workspace/solana-client/get-account-token-info'
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
  account: ExistingFetchedAccount
}) {
  const { t } = useTranslation('explorer')
  const type: AccountType = getAccountType({ account })
  const tokenInfo = getAccountTokenInfo({ account })

  switch (type) {
    case 'token-account':
      if (tokenInfo?.type !== 'token-account') {
        return (
          <ExplorerUiError
            message={t(($) => $.unexpectedParsedTokenAccountData)}
            title={t(($) => $.unknownTokenType)}
          />
        )
      }

      return (
        <ExplorerFeatureAccountInfoTokenAccount
          basePath={basePath}
          extensions={tokenInfo.extensions}
          mint={tokenInfo.mint}
          mintAmount={tokenInfo.mintAmount}
          mintDecimals={tokenInfo.mintDecimals}
        />
      )
    case 'token-mint':
      if (tokenInfo?.type !== 'token-mint') {
        return (
          <ExplorerUiError message={t(($) => $.unexpectedParsedTokenMintData)} title={t(($) => $.unknownTokenType)} />
        )
      }

      return (
        <ExplorerFeatureAccountInfoTokenMint
          basePath={basePath}
          freezeAuthority={tokenInfo.freezeAuthority}
          mintAuthority={tokenInfo.mintAuthority}
          mintDecimals={tokenInfo.mintDecimals}
          mintSupply={tokenInfo.mintSupply}
        />
      )
    case 'token-unknown':
      return <ExplorerUiError message={`${t(($) => $.unexpectedType)} ${type}`} title={t(($) => $.unknownTokenType)} />
    case 'system':
    case 'system-program':
      return null
    default:
      return <ExplorerUiDetailRow label={t(($) => $.unknownAccount)} value={<UiDebug data={account.data} />} />
  }
}
