import { ellipsify } from '@workspace/ui/lib/ellipsify'

import { useExtensionActiveWallet } from '@/features/shell/use-extension-active-wallet.tsx'

export function ExtensionPortfolioIndex() {
  const { data: active } = useExtensionActiveWallet()

  if (!active) {
    return <div className="text-red-400">YOUR WALLET IS NOT ACTIVE THIS SHOULD NOT HAPPEN HALP</div>
  }

  return (
    <div>
      <div>Your wallet</div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Active Wallet</h1>
        <div className="text-sm text-gray-500">{ellipsify(active.publicKey)}</div>
      </div>
    </div>
  )
}
