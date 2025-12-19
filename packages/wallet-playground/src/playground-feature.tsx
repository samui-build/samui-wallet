import { useWallets } from '@wallet-standard/react'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { ExplorerUiDetailGrid } from '@workspace/explorer/ui/explorer-ui-detail-grid'
import { useSearchParams } from 'react-router'
import { PlaygroundFeatureWallets } from './playground-feature-wallets.tsx'
import { PlaygroundUiEmpty } from './playground-ui-empty.tsx'
import { PlaygroundUiWalletSuggestions } from './playground-ui-wallet-suggestions.tsx'

export function useSolanaWallets() {
  return useWallets().filter(({ chains }) => chains.some((chain) => chain.startsWith('solana:')))
}

export default function PlaygroundFeature() {
  const wallets = useSolanaWallets()
  const network = useNetworkActive()
  const [params, setParams] = useSearchParams()
  const selectedWalletName = params.get('name')
  const selectedWallet = wallets.find((wallet) => wallet.name === selectedWalletName) ?? null

  return (
    <ExplorerUiDetailGrid>
      {wallets.length ? (
        <PlaygroundFeatureWallets
          network={network}
          selectedWallet={selectedWallet}
          selectWallet={(name) => setParams({ name })}
          wallets={wallets}
        />
      ) : (
        <PlaygroundUiEmpty
          description="It looks like you have no Solana wallets installed."
          title="No Solana wallets found."
        >
          <div>Install any of the wallets below to get started.</div>
          <PlaygroundUiWalletSuggestions />
        </PlaygroundUiEmpty>
      )}
    </ExplorerUiDetailGrid>
  )
}
