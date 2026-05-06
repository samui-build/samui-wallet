import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { useGetTokenAccounts } from '@workspace/solana-client-react/use-get-token-accounts'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiTokenTable } from './ui/explorer-ui-token-table.tsx'

export function ExplorerFeatureAccountTokens({
  address,
  basePath,
  network,
}: {
  address: Address
  basePath: string
  network: Network
}) {
  const { t } = useTranslation('explorer')
  const query = useGetTokenAccounts({ address, network })
  if (query.isLoading) {
    return <UiLoader />
  }
  if (query.isError) {
    return <ExplorerUiErrorPage message={query.error.message} title="Error getting token account" />
  }

  const accounts = query.data ?? []
  return (
    <UiCard
      action={
        <Button onClick={() => query.refetch()} size="sm" variant="secondary">
          <UiIcon icon="refresh" />
          {t(($) => $.actionRefresh)}
        </Button>
      }
      title={<div>{t(($) => $.accountTokensTitle)}</div>}
    >
      <ExplorerUiTokenTable basePath={basePath} items={accounts} />
    </UiCard>
  )
}
