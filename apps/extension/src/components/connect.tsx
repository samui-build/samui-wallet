import { getDbService } from '@workspace/background/services/db'
import { getRequestService } from '@workspace/background/services/request'
import { Button } from '@workspace/ui/components/button'

export function Connect() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">Connect</h1>
      <div className="flex flex-col gap-2">
        <Button
          onClick={async () => await getRequestService().resolve(await getDbService().wallet.walletAccounts())}
          variant="destructive"
        >
          Approve
        </Button>
        <Button onClick={async () => await getRequestService().reject()}>Reject</Button>
      </div>
    </div>
  )
}
