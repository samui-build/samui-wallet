import { type UiWallet, useConnect } from '@wallet-standard/react'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { LucidePlug } from 'lucide-react'
import { toast } from 'sonner'

export function PlaygroundUiWalletConnect({ wallet }: { wallet: UiWallet }) {
  const [isLoading, connect] = useConnect(wallet)

  return (
    <Button
      disabled={isLoading}
      onClick={async () =>
        connect().catch((err) => {
          toast.error(`Error connecting wallet: ${err}`)
        })
      }
      size="sm"
      variant="secondary"
    >
      {isLoading ? <Spinner /> : <LucidePlug />}
      Connect
    </Button>
  )
}
