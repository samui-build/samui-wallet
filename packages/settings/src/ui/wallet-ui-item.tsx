import type { Wallet } from '@workspace/db/entity/wallet'

import { WalletUiIcon } from './wallet-ui-icon.tsx'

export function WalletUiItem({ wallet }: { wallet: Wallet }) {
  return (
    <span className="flex items-center gap-2">
      <WalletUiIcon type={wallet.type} />
      <span className="font-mono">{wallet.name}</span>
    </span>
  )
}
