import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ExplorerFeatureBookmarkAccountButton } from './explorer-feature-bookmark-account-button.tsx'
import { ExplorerUiDetailGrid } from './ui/explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiExplorers } from './ui/explorer-ui-explorers.tsx'
import { ExplorerUiLinkAddress } from './ui/explorer-ui-link-address.tsx'

export function ExplorerFeatureAccountOverview({
  backButtonTo,
  basePath,
  address,
  network,
}: {
  backButtonTo: string
  basePath: string
  address: Address
  network: Network
}) {
  const { t } = useTranslation('explorer')
  const query = useGetAccountInfo({ address, network })
  if (query.isLoading) {
    return <UiLoader />
  }
  if (query.isError) {
    return <ExplorerUiErrorPage message={query.error.message} title="Error getting account overview" />
  }

  return (
    <UiCard
      action={
        <div className="flex items-center gap-2">
          <ExplorerFeatureBookmarkAccountButton address={address} />
          <Button onClick={() => query.refetch()} size="sm" variant="secondary">
            <UiIcon icon="refresh" />
            {t(($) => $.actionRefresh)}
          </Button>
        </div>
      }
      backButtonTo={backButtonTo}
      description={<ExplorerUiExplorers network={network} path={`/address/${address}`} />}
      title={<div>{t(($) => $.accountOverviewTitle)}</div>}
    >
      <ExplorerUiDetailGrid>
        <ExplorerUiDetailRow label={t(($) => $.address)} value={address} />
        {query.data?.value?.owner ? (
          <ExplorerUiDetailRow
            label={t(($) => $.owner)}
            value={<ExplorerUiLinkAddress address={query.data.value.owner} basePath={basePath} />}
          />
        ) : null}
        {query.data?.value?.lamports !== undefined ? (
          <ExplorerUiDetailRow label={t(($) => $.lamports)} value={query.data.value.lamports} />
        ) : null}
      </ExplorerUiDetailGrid>
    </UiCard>
  )
}
