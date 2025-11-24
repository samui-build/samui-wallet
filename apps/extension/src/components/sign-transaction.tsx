import type { SolanaSignTransactionInput } from '@solana/wallet-standard-features'

import { getRequestService } from '@workspace/background/services/request'
import { getSignService } from '@workspace/background/services/sign'
import { Button } from '@workspace/ui/components/button'

interface SignTransactionProps {
  data: SolanaSignTransactionInput[]
}

export function SignTransaction({ data }: SignTransactionProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-center font-bold text-2xl">Sign Transaction</h1>
      <div className="flex flex-col gap-2">
        <Button
          onClick={async () => await getRequestService().resolve(await getSignService().signTransaction(data))}
          variant="destructive"
        >
          Approve
        </Button>
        <Button onClick={async () => await getRequestService().reject()}>Reject</Button>
      </div>
    </div>
  )
}
