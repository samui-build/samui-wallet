import { address } from '@solana/kit'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/entity/network'
import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { PortfolioUiExplorerLink } from '@workspace/portfolio/ui/portfolio-ui-explorer-link'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { ToolsUiAirdropForm } from './ui/tools-ui-airdrop-form.tsx'

export default function ToolsFeatureAirdrop(props: { account: Account; network: Network }) {
  const accounts = useAccountOptions()
  const { isPending, mutateAsync } = useRequestAirdrop(props.network)
  return (
    <UiCard backButtonTo="/tools" title="Airdrop">
      <ToolsUiAirdropForm
        accounts={accounts}
        disabled={isPending}
        submit={async (input) => {
          const signature = await mutateAsync({ ...input, address: address(input.address) })
          toastSuccess(
            <PortfolioUiExplorerLink
              label="View on explorer"
              network={props.network}
              path={`/tx/${signature}`}
              provider="solana"
            />,
          )
        }}
      />
    </UiCard>
  )
}

export function useAccountOptions() {
  return [...new Map(useDbAccountLive().map((item) => [item.publicKey, item])).values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ label: i.name, value: i.publicKey }))
}
