import type { UiWallet } from '@wallet-standard/react'
import { Button } from '@workspace/ui/components/button'
import { WalletUiIcon } from './wallet-ui-icon.tsx'

export function PlaygroundUiWalletList({
  selectedWallet,
  setActiveWallet,
  wallets,
}: {
  setActiveWallet: (wallet: UiWallet) => void
  selectedWallet: UiWallet | null
  wallets: UiWallet[]
}) {
  return (
    <div className="space-y-4">
      {wallets.map((wallet) => (
        <Button
          className="flex w-full justify-start pr-2 text-lg"
          key={wallet.name}
          onClick={() => setActiveWallet(wallet)}
          size="lg"
          variant={wallet.name === selectedWallet?.name ? 'outline' : 'secondary'}
        >
          <WalletUiIcon wallet={wallet} />
          {wallet.name}
        </Button>
      ))}
    </div>
  )
}
