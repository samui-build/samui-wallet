import type { UiWallet } from '@wallet-standard/react'
import type { Network } from '@workspace/db/network/network'
import { PlaygroundFeatureWalletListItem } from './playground-feature-wallet-list-item.tsx'
import { PlaygroundUiEmpty } from './playground-ui-empty.tsx'
import { PlaygroundUiWalletList } from './playground-ui-wallet-list.tsx'

export function PlaygroundFeatureWallets({
  network,
  selectedWallet,
  selectWallet,
  wallets,
}: {
  network: Network
  selectedWallet: UiWallet | null
  selectWallet: (name: string) => void
  wallets: UiWallet[]
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-0 gap-y-2 md:grid-cols-3 md:gap-4 md:space-y-0 md:space-y-6">
        <div className="">
          <PlaygroundUiWalletList
            selectedWallet={selectedWallet}
            setActiveWallet={(wallet) => selectWallet(wallet.name)}
            wallets={wallets}
          />
        </div>
        <div className="col-span-2">
          {selectedWallet ? (
            <PlaygroundFeatureWalletListItem network={network} wallet={selectedWallet} />
          ) : (
            <PlaygroundUiEmpty description="Select a wallet from the list to continue" title="Select wallet" />
          )}
        </div>
      </div>
    </div>
  )
}
