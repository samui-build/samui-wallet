import { useQuery } from '@tanstack/react-query'
import { getRequestService } from '@workspace/background/services/request'
import { Button } from '@workspace/ui/components/button'

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
              onClick={async () =>
                getRequestService().resolve({
                  accounts: [
                    {
                      address: '0x1234567890abcdef',
                      chains: [],
                      features: [],
                      // icon: '',
                      // label: 'My Account',
                      publicKey: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                    },
                  ],
                })
              }
              variant="destructive"
            >
              Approve
            </Button>
            <Button onClick={async () => getRequestService().reject()}>Reject</Button>
          </div>
        </div>
      )

    default:
      throw new Error('Unknown request type')
  }
}
