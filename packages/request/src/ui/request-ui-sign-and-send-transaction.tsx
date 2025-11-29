import type { SolanaSignAndSendTransactionInput } from '@solana/wallet-standard-features'

import { getRequestService } from '@workspace/background/services/request'
import { getSignService } from '@workspace/background/services/sign'
import { Button } from '@workspace/ui/components/button'

export interface RequestSignAndSendTransactionProps {
  data: SolanaSignAndSendTransactionInput[]
}

export function RequestUiSignAndSendTransaction({ data }: RequestSignAndSendTransactionProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-center font-bold text-2xl">Sign and Send Transaction</h1>
      <div className="flex flex-col gap-2">
        <Button
          onClick={async () => await getRequestService().resolve(await getSignService().signAndSendTransaction(data))}
          variant="destructive"
        >
          Approve
        </Button>
        <Button onClick={async () => await getRequestService().reject()}>Reject</Button>
      </div>
    </div>
  )
}
