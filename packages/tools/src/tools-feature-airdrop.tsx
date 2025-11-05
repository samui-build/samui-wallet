import { address } from '@solana/kit'
import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { PortfolioUiExplorerLink } from '@workspace/portfolio/ui/portfolio-ui-explorer-link'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { UiCard } from '@workspace/ui/components/ui-card'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { ToolsUiAirdropForm } from './ui/tools-ui-airdrop-form.tsx'

export default function ToolsFeatureAirdrop(props: { cluster: Cluster; wallet: Wallet }) {
  const wallets = useWalletOptions()
  const { isPending, mutateAsync } = useRequestAirdrop(props.cluster)
  return (
    <UiCard backButtonTo="/tools" title="Airdrop">
      <ToolsUiAirdropForm
        disabled={isPending}
        submit={async (input) => {
          const signature = await mutateAsync({ ...input, address: address(input.address) })
          toastSuccess(
            <PortfolioUiExplorerLink cluster={props.cluster} label="View on explorer" path={`/tx/${signature}`} />,
          )
        }}
        wallets={wallets}
      />
    </UiCard>
  )
}

export function useWalletOptions() {
  return [...new Map(useDbWalletLive().map((item) => [item.publicKey, item])).values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ label: i.name, value: i.publicKey }))
}
