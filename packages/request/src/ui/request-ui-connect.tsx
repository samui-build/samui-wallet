import { getDbService } from '@workspace/background/services/db'
import { getRequestService } from '@workspace/background/services/request'
import { Button } from '@workspace/ui/components/button'

export function RequestUiConnect() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-center font-bold text-2xl">Connect</h1>
      <div className="flex flex-col gap-2">
        <Button
          onClick={async () => await getRequestService().resolve(await getDbService().account.walletAccounts())}
          variant="destructive"
        >
          Approve
        </Button>
        <Button onClick={async () => await getRequestService().reject()}>Reject</Button>
      </div>
    </div>
  )
}
