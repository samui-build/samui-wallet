import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { UiCard } from '@workspace/ui/components/ui-card'

import { ToolsUiAirdropForm } from './ui/tools-ui-aidrop-form.js'

export default function ToolsFeatureAirdrop(props: { cluster: Cluster; wallet: Wallet }) {
  const wallets = useWalletOptions()
  const { isPending, mutateAsync } = useRequestAirdrop(props.cluster)
  return (
    <UiCard backButtonTo="/tools" title="Airdrop">
      <ToolsUiAirdropForm
        disabled={isPending}
        submit={async (input) => {
          console.log('i', input)
          await mutateAsync(input)
        }}
        wallets={wallets}
      />
    </UiCard>
  )
}

export function useWalletOptions() {
  return useDbWalletLive()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ label: i.name, value: i.publicKey }))
}
