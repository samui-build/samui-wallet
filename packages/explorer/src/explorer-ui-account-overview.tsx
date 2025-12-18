import type { Address } from '@solana/kit'
import { useTranslation } from '@workspace/i18n'
import type { GetAccountInfoResult } from '@workspace/solana-client/get-account-info'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerUiAccountOverview({
  accountInfo,
  address,
  basePath,
}: {
  accountInfo: GetAccountInfoResult
  address: Address
  basePath: string
}) {
  const { t } = useTranslation('explorer')

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      <ExplorerUiDetailRow label={t(($) => $.address)} value={address} />
      {accountInfo?.value?.owner ? (
        <ExplorerUiDetailRow
          label={t(($) => $.owner)}
          value={<ExplorerUiLinkAddress address={accountInfo.value.owner} basePath={basePath} />}
        />
      ) : null}
      {accountInfo?.value?.lamports !== undefined ? (
        <ExplorerUiDetailRow label={t(($) => $.lamports)} value={accountInfo.value.lamports} />
      ) : null}
    </div>
  )
}
