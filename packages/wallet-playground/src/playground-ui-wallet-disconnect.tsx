import type { UiWallet } from '@wallet-standard/react'

import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { LucideUnplug } from 'lucide-react'

export function PlaygroundUiWalletDisconnect({ wallet }: { wallet: UiWallet }) {
  // const [isLoading, disconnect] = useDisconnect(wallet)
  const [isLoading, disconnect] = [
    false,
    () => {
      console.log(wallet)
      return
    },
  ]

  return (
    <Button disabled={isLoading} onClick={() => disconnect()} size="sm" variant="secondary">
      {isLoading ? <Spinner /> : <LucideUnplug />}
      Disconnect
    </Button>
  )
}
