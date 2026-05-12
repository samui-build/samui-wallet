import type { SolanaSignMessageInput } from '@solana/wallet-standard-features'

import { getRequestService } from '@workspace/background/services/request'
import { getSignService } from '@workspace/background/services/sign'
import { Button } from '@workspace/ui/components/button'
import { useRequestSignApproval } from '../data-access/use-request-sign-approval.tsx'
import { RequestUiUnlockDialog } from './request-ui-unlock-dialog.tsx'

export interface RequestUiSignMessageProps {
  data: SolanaSignMessageInput[]
}

export function RequestUiSignMessage({ data }: RequestUiSignMessageProps) {
  const approval = useRequestSignApproval()

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-center font-bold text-2xl">Sign Message</h1>
      <div className="flex flex-col gap-2">
        <Button
          disabled={approval.state.isBusy}
          onClick={() =>
            approval.approve(async () => await getRequestService().resolve(await getSignService().signMessage(data)))
          }
          variant="destructive"
        >
          {approval.state.isChecking ? 'Checking...' : approval.state.isApproving ? 'Approving...' : 'Approve'}
        </Button>
        <Button onClick={async () => await getRequestService().reject()}>Reject</Button>
      </div>
      <RequestUiUnlockDialog approval={approval} />
    </div>
  )
}
