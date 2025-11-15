import type { Signature } from '@solana/kit'
import type { Network } from '@workspace/db/entity/network'
import { Spinner } from '@workspace/ui/components/spinner'
import { useExplorerGetTransaction } from './data-access/use-explorer-get-transaction.ts'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiTxDetails } from './ui/explorer-ui-tx-details.tsx'

export function ExplorerFeatureTxDetails({ network, signature }: { network: Network; signature: Signature }) {
  const query = useExplorerGetTransaction({ network, signature })

  if (query.isLoading) {
    return <Spinner />
  }

  if (query.isError || !query.data) {
    return <ExplorerUiErrorPage message={query.error?.message ?? 'Unknown error'} title="Error getting transaction" />
  }

  return <ExplorerUiTxDetails network={network} signature={signature} tx={query.data} />
}
