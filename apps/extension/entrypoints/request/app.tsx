import { useQuery } from '@tanstack/react-query'
import { getDbService } from '@workspace/background/services/db'
import { getRequestService } from '@workspace/background/services/request'
import { getSignService } from '@workspace/background/services/sign'
import { Button } from '@workspace/ui/components/button'

// TODO: Refactor each type into its own component
export function App() {
  const { data, isLoading } = useQuery({
    queryFn: async () => await getRequestService().get(),
    queryKey: ['request'],
  })

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

  switch (data.type) {
    case 'connect':
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

    case 'signMessage':
      return (
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">Sign Message</h1>
          <div className="flex flex-col gap-2">
            <Button
              onClick={async () => await getRequestService().resolve(await getSignService().signMessage(data.data))}
              variant="destructive"
            >
              Approve
            </Button>
            <Button onClick={async () => await getRequestService().reject()}>Reject</Button>
          </div>
        </div>
      )

    default:
      throw new Error('Unknown request type')
  }
}
